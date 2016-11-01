# Start with the ubuntu image
FROM ubuntu
# Update apt cache
RUN apt-get -y update
# Install ansible dependencies
RUN apt-get install -y openssh-server python-yaml python-jinja2 git software-properties-common \
    && add-apt-repository ppa:ansible/ansible \
    && apt-get -y update \
    && apt-get install -y ansible

# add playbooks to the image. This might be a git repo instead
ADD playbooks/ /etc/ansible/
ADD inventory /etc/ansible/hosts
ADD roles/ /etc/ansible/
ADD site.yml /etc/ansible/site.yml
WORKDIR /etc/ansible

# Run ansible using the site.yml playbook 
RUN ansible-playbook /etc/ansible/site.yml -c local

CMD ["/usr/sbin/init"]
