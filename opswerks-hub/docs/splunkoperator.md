# Installing and Running Splunk Operator and Splunk Enterprise

This guide provides step-by-step instructions for installing and running the Splunk Operator and Splunk Enterprise on Kubernetes without using Helm.

## Prerequisites

Before you begin, ensure you have the following:
- A running Kubernetes cluster.
- The `kubectl` command-line tool installed and configured to interact with your cluster.
- An understanding of Kubernetes concepts like Pods, Services, and Custom Resource Definitions (CRDs).

## Step 1: Install the Splunk Operator

1. **Clone the Splunk Operator repository**:

   ```bash
   git clone https://github.com/splunk/splunk-operator.git
   cd splunk-operator
   ```

2. **Create the Splunk Operator namespace**:

   ```bash
   kubectl create namespace splunk-operator
   ```

3. **Deploy the Splunk Operator**:

   To deploy the Splunk Operator, apply the required Custom Resource Definitions (CRDs) and the Operator itself:

   ```bash
   kubectl apply -f deploy/crds/splunk.com_splunkenterpriseclusters_crd.yaml
   kubectl apply -f deploy/operator.yaml -n splunk-operator
   ```

## Step 2: Install Splunk Enterprise

1. **Create a Custom Resource for Splunk Enterprise**:

   Create a file named `splunkenterprisecluster.yaml` with the following configuration:

   ```yaml
   apiVersion: splunk.com/v1
   kind: SplunkEnterpriseCluster
   metadata:
     name: my-splunk
     namespace: splunk-operator
   spec:
     members:
       replicas: 3
     storage:
       storageClassName: standard
       size: 100Gi
     license:
       licenseMaster:
         serviceName: license-master
   ```

   This configuration sets up a Splunk Enterprise cluster with 3 members.

2. **Deploy Splunk Enterprise**:

   Apply the Custom Resource to create the Splunk Enterprise cluster:

   ```bash
   kubectl apply -f splunkenterprisecluster.yaml
   ```

## Step 3: Verify the Installation

1. **Check the status of the Splunk Operator and Splunk Enterprise Pods**:

   ```bash
   kubectl get pods --namespace splunk-operator
   ```

2. **Check the logs of the Splunk Operator**:

   ```bash
   kubectl logs -l app=splunk-operator -n splunk-operator
   ```

## Step 4: Access Splunk Enterprise

To access the Splunk Enterprise UI, you may need to set up a service or port forwarding. For example:

```bash
kubectl port-forward svc/my-splunk-svc 8000:8000 -n splunk-operator
```

Now, you can access Splunk Enterprise at `http://localhost:8000`.

## Step 5: Cleanup

To delete the Splunk Enterprise installation and the Splunk Operator:

```bash
kubectl delete -f splunkenterprisecluster.yaml
kubectl delete namespace splunk-operator
```

---

This tutorial was adapted from the official [Splunk Operator documentation](https://splunk.github.io/splunk-operator/).

