# Installing CassandraDB on Kubernetes

This guide provides a step-by-step procedure for deploying Cassandra, a stateful, distributed database, on Kubernetes.

## Prerequisites

Before you begin, ensure you have the following:
- A running Kubernetes cluster.
- The `kubectl` command-line tool installed and configured to interact with your cluster.
- Basic knowledge of Kubernetes concepts, such as Pods, StatefulSets, and Persistent Volumes.

## Step 1: Create a Namespace

First, create a dedicated namespace for Cassandra to keep its resources organized.

```bash
kubectl create namespace cassandra
```

## Step 2: Create a Headless Service

Cassandra nodes need to discover each other. A headless service will handle this task.

Create a `cassandra-service.yaml` file with the following content:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: cassandra
  namespace: cassandra
  labels:
    app: cassandra
spec:
  clusterIP: None
  selector:
    app: cassandra
  ports:
  - port: 9042
    name: cql
```

Apply the service to your Kubernetes cluster:

```bash
kubectl apply -f cassandra-service.yaml
```

## Step 3: Deploy the StatefulSet

The StatefulSet will manage the Cassandra pods, ensuring they retain stable network identities and storage.

Create a `cassandra-statefulset.yaml` file with the following configuration:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: cassandra
  namespace: cassandra
spec:
  serviceName: cassandra
  replicas: 3
  selector:
    matchLabels:
      app: cassandra
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      containers:
      - name: cassandra
        image: cassandra:3.11
        ports:
        - containerPort: 7000
          name: intra-node
        - containerPort: 7001
          name: tls-intra-node
        - containerPort: 7199
          name: jmx
        - containerPort: 9042
          name: cql
        volumeMounts:
        - name: cassandra-data
          mountPath: /var/lib/cassandra
  volumeClaimTemplates:
  - metadata:
      name: cassandra-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

Apply the StatefulSet to your Kubernetes cluster:

```bash
kubectl apply -f cassandra-statefulset.yaml
```

## Step 4: Verify the Installation

Check the status of the Pods:

```bash
kubectl get pods --namespace cassandra
```

To see if Cassandra is running correctly:

```bash
kubectl exec -it cassandra-0 -- nodetool status
```

## Step 5: Scaling the Cluster

You can scale the Cassandra cluster by increasing the number of replicas:

```bash
kubectl scale statefulset cassandra --replicas=4 --namespace=cassandra
```

---

This tutorial was adapted from the official [Kubernetes CassandraDB documentation](https://kubernetes.io/docs/tutorials/stateful-application/cassandra/).

