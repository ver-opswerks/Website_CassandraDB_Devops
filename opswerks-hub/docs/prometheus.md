# Installing Prometheus Using Prometheus Operator

This guide provides detailed steps on how to install **Prometheus** in a Kubernetes cluster using the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator). The Prometheus Operator simplifies deploying, scaling, and managing Prometheus-based monitoring solutions.

---

## Pre-requisites

Ensure you have the following pre-requisites set up before proceeding:

- A running **Kubernetes cluster** (version >= 1.16).
- **kubectl** installed and configured to interact with your Kubernetes cluster.
- **Helm** installed (version >= 3).

---


## Step 1: Clone the Prometheus Operator Repository

To start, clone the **Prometheus Operator** repository from GitHub.

1. Install **Git** (if not installed):

    - **Debian-based (Ubuntu, Debian)**:

      ```bash
      sudo apt update && sudo apt install git -y
      ```

    - **RHEL-based (Red Hat, CentOS, Fedora)**:

      ```bash
      sudo yum install git -y
      ```

2. Clone the Prometheus Operator repository:

    ```bash
    git clone https://github.com/prometheus-operator/prometheus-operator.git
    cd prometheus-operator
    ```

---

## Step 2: Add the Prometheus Helm Chart Repository

The Prometheus Operator uses Helm charts to simplify the deployment of Prometheus and its components.

1. Add the **Prometheus community** Helm chart repository:

    ```bash
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    ```

2. Update your local Helm chart repository cache:

    ```bash
    helm repo update
    ```

---

## Step 3: Deploy Prometheus Using Helm

Now, deploy Prometheus and the Prometheus Operator using Helm.

1. Install the **Kube-Prometheus-Stack** Helm chart, which includes Prometheus, Grafana, and Alertmanager:

    ```bash
    helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
    ```

    This command installs the Prometheus Operator and all required components, such as Prometheus, Alertmanager, and Grafana, under the `monitoring` namespace.

2. Verify that all the components are running by checking the pods in the `monitoring` namespace:

    ```bash
    kubectl get pods -n monitoring
    ```

    You should see pods for Prometheus, Grafana, Alertmanager, and other components.

---

## Step 4: Access Prometheus

To access Prometheus, you can use port forwarding to connect to the Prometheus UI from your local machine.

1. Port forward the Prometheus server:

    ```bash
    kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
    ```

2. Open your browser and navigate to:

    ```
    http://localhost:9090
    ```

    You should now see the Prometheus UI.

---

## Step 5: Access Grafana (Optional)

Grafana is also deployed as part of the Kube-Prometheus stack. You can use it to visualize metrics collected by Prometheus.

1. Port forward Grafana:

    ```bash
    kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
    ```

2. Open your browser and navigate to:

    ```
    http://localhost:3000
    ```

3. The default Grafana credentials are:
    - **Username**: `admin`
    - **Password**: `prom-operator`

    You can now log into Grafana and configure dashboards to visualize your metrics.

---

## Step 6: Clean Up (Optional)

If you want to remove Prometheus and all related components from your Kubernetes cluster:

1. Uninstall the Prometheus Helm chart:

    ```bash
    helm uninstall prometheus -n monitoring
    ```

2. Delete the `monitoring` namespace:

    ```bash
    kubectl delete namespace monitoring
    ```

---

## Conclusion

You have successfully deployed Prometheus using the Prometheus Operator in your Kubernetes cluster. With Prometheus running, you can start monitoring your applications and cluster performance. Optionally, Grafana provides advanced visualization capabilities for Prometheus metrics.

