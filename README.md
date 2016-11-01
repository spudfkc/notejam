Toptal Project
==============

Requirements
------------
 * terraform
 * ansible
 * terraform-inventory

Project Goals
--------------------
 [x] Completely automated provisioning via Ansible + Terraform
 [x] Deployment of new code is automated via CircleCI + Ansible
 [x] Automated tests via CircleCI
 [x] Database backups via AWS RDS
 [x] Centralized logging via Loggly
 [x] Forked repository
 [x] Deployed to major cloud provider via AWS
 [x] Historical metrics via Loggly

Infrastructure Overview
-----------------------
All AWS infrastructure is provisioned via Terraform. You can find the definition of the infrastrufture in `terraform/infra.tf`. You can also find what terraform variables are used in `terraform/terraform.tfvars.example` (copy this to `terraform/terraform.tfvars` and fill out).
When running Terraform updates, be sure to encrypt and copy the `tfstate` to `ansible/terraform.tfstate.encrypted` since this file is used during the automated deployments.

Scaling nodes is done here. You can change the count and size of notejam instances, as well as the size of the RDS instance in `terraform/variables.tf`.


The notejam application itself is deployed via Ansible. You can find all relevant ansible files in `ansible/`. The two major playbooks for ansible are `ansible/site.yml` and `ansible/db.yml`. The `site.yml` file will [re]deploy the application, while the `db.yml` playbook will just initialize the database with fixtures.

This project is designed to be used with the `terraform-inventory` utility for ansible; this tool will generate the ansible inventory from the terraform state file (which is why we need `terraform.tfstate.encrypted` here).

All secrets used for the deployment are stored in `ansible/secrets.yml` and this file is encrypted with `ansible-vault`. You can use `ansible-vault edit secrets.yml` to view and edit the file.

For an example of the ansible deployment being run, check out the `bin/deploy` script (it is meant to be run from the `ansible/` directory.


There are start/stop/deploy scripts in the `bin/` directory.



External Tools
--------------
CircleCI is used to handle automated tests and deployment.
AWS is used for hosting the notejam instances, a load-balancer, and the database.
Loggly is used to aggregate the logs of the notejam instances.
Ansible is used to deploy the notejam application to the servers.
Terraform is used to declare and provision the AWS resources.

The login credentials will be provided as needed.



How to Use this Project
-----------------------

The `bin` directory contains some simple wrapper scripts to do your basic infrastructure commands: 
 - start: start up the infrastructure (basically runs `terraform apply`)
 - stop: stop, or destroy, the current infrastructure (basically runs `terraform destroy`)
 - deploy: deploys notejam to the current infrastructure using Ansible
 - scale: TODO

When running terraform commands, be sure to have a .tfstate file that is the current state of the terraform infrastructure. This file will need to be encryped (using Ansible Vault) and saved in the repo.

The `terraform` directory contains all necessary terraform files.

The `ansible` directory contains all the ansible playbooks and roles used for deployment.
The main playbook is `site.yml` that will deploy notejam to a server. The `db.yml` playbook is meant to be run once to install the database fixtures.
The `secrets.yml` file is an ansible-vault encrypted file that contains all secrets necessary for the 

Note: the `inventory` file used during the `db.yml` playbook will need a server specified.
Note: the terraform.tfstate.encrypted file will need to be updated when the tfstate changes.


