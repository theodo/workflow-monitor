#!/bin/bash

ansible-playbook -i devops/provisioning/hosts/prod devops/provisioning/deploy.yml
