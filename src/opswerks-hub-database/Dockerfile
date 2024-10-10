# Use the official Cassandra image
FROM cassandra:latest

# Expose the default Cassandra ports
EXPOSE 9042 7000 7001 7199 9160

# Add a custom script to create the keyspace
COPY init.cql /docker-entrypoint-initdb.d/

# Optionally, you can add custom configurations
# COPY cassandra.yaml /etc/cassandra/cassandra.yaml

# The default CMD to run Cassandra is already in place in the base image
