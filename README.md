Toptal Project
==============

Project Requirements
--------------------


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


