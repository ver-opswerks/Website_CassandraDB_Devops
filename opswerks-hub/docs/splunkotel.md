# Installing and Running Splunk OpenTelemetry Collector for Splunk Enterprise

This guide provides step-by-step instructions for installing and running the Splunk OpenTelemetry (OTel) Collector for Splunk Enterprise on Kubernetes.

## Prerequisites

Before you begin, ensure you have the following:
- A running Kubernetes cluster.
- The `kubectl` command-line tool installed and configured to interact with your cluster.
- An understanding of Kubernetes concepts like Pods, Services, and Custom Resource Definitions (CRDs).

## Step 1: Install the Splunk OpenTelemetry Collector

1. **Clone the Splunk OpenTelemetry Collector repository**:

   ```bash
   git clone https://github.com/signalfx/splunk-otel-collector-chart.git
   cd splunk-otel-collector-chart
   ```

2. **Create a namespace for the OpenTelemetry Collector**:

   ```bash
   kubectl create namespace splunk-otel
   ```

3. **Deploy the OpenTelemetry Collector**:

   Create a configuration file for the OpenTelemetry Collector, for example, `otel-collector-config.yaml`, and include your Splunk Enterprise configuration:

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: splunk-otel-collector
     namespace: splunk-otel
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: splunk-otel-collector
     template:
       metadata:
         labels:
           app: splunk-otel-collector
       spec:
         containers:
         - name: splunk-otel-collector
           image: ghcr.io/signalfx/splunk-otel-collector:latest
           env:
           - name: SPLUNK_ACCESS_TOKEN
             value: "<YOUR_SPLUNK_ACCESS_TOKEN>"
           - name: SPLUNK_REALM
             value: "<YOUR_SPLUNK_REALM>"
           ports:
           - containerPort: 4317 # gRPC port
           - containerPort: 8000  # HTTP port
           volumeMounts:
           - name: config-volume
             mountPath: /etc/otel
         volumes:
         - name: config-volume
           configMap:
             name: otel-collector-config
   ```

   Replace `<YOUR_SPLUNK_ACCESS_TOKEN>` and `<YOUR_SPLUNK_REALM>` with your actual Splunk credentials.

4. **Apply the configuration**:

   ```bash
   kubectl apply -f otel-collector-config.yaml
   ```

## Step 2: Verify the Installation

1. **Check the status of the OpenTelemetry Collector Pods**:

   ```bash
   kubectl get pods --namespace splunk-otel
   ```

2. **Check the logs of the OpenTelemetry Collector**:

   ```bash
   kubectl logs -l app=splunk-otel-collector -n splunk-otel
   ```

## Step 3: Accessing the OpenTelemetry Collector

To access the OpenTelemetry Collector service, you may need to set up a service or port forwarding. For example:

```bash
kubectl port-forward svc/splunk-otel-collector 4317:4317 -n splunk-otel
```

## Step 4: Cleanup

To delete the OpenTelemetry Collector installation:

```bash
kubectl delete -f otel-collector-config.yaml
kubectl delete namespace splunk-otel
```

---

This tutorial was adapted from the official [Splunk OpenTelemetry Collector documentation](https://github.com/signalfx/splunk-otel-collector-chart).

