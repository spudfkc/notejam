provider "aws" {
    access_key = "${var.aws_access_key}"
    secret_key = "${var.aws_secret_key}"
    region     = "${var.aws_region}"
}

## ---- EC2/VPC

resource "aws_instance" "notejam" {
    ami = "${var.ami_id}"
    count = "${var.number_of_instances}"
    instance_type = "${var.instance_type}"
    user_data = "${file(var.user_data)}"
    vpc_security_group_ids = ["${aws_security_group.allow_internal.id}"]
    key_name = "${var.key_pair_name}"
    tags {
        Name = "${var.instance_name}-${count.index}"
    }

    provisioner "local-exec" {
        command = "echo ${aws_instance.notejam.public_dns} >> instances.txt"
    }
}

resource "aws_security_group" "allow_internal" {
  name = "allow_internal"
  description = "Allow inbound traffic from this Security Group"

  ingress {
      from_port = 0
      to_port = 0
      protocol = "-1"
      self = true
  }

  ingress {
      from_port = 22
      to_port = 22
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "allow_internal"
  }
}

resource "aws_security_group" "allow_from_public" {
  name = "allow_web_from_elb"
  description = "Allow inbound traffic from ELB"

  ingress {
      from_port = 443
      to_port = 443
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
      from_port = 80
      to_port = 80
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "allow_web_from_elb"
  }
}

resource "aws_elb" "notejam-elb" {
  name = "notejam-elb"
  availability_zones = ["us-east-2a", "us-east-2b", "us-east-2c"]

  listener {
    instance_port = 3000
    instance_protocol = "http"
    lb_port = 80
    lb_protocol = "http"
  }

  # listener {
  #   instance_port = 3000
  #   instance_protocol = "http"
  #   lb_port = 443
  #   lb_protocol = "https"
  #   ssl_certificate_id = "arn:aws:iam::123456789012:server-certificate/certName"
  # }

  health_check {
    healthy_threshold = 3
    unhealthy_threshold = 4
    timeout = 3
    target = "HTTP:3000/signin"
    interval = 30
  }

  instances = ["${aws_instance.notejam.id}"]
  cross_zone_load_balancing = true
  idle_timeout = 400
  connection_draining = true
  connection_draining_timeout = 400
  security_groups = ["${aws_security_group.allow_internal.id}", "${aws_security_group.allow_from_public.id}"]
  tags {
    Name = "notejam-elb"
  }
}

resource "aws_db_instance" "notejam-db" {
    allocated_storage      = 10
    engine                 = "mysql"
    engine_version         = "5.7.11"
    instance_class         = "db.t2.micro"
    name                   = "notejam"
    username               = "${var.notejam_db_user}"
    password               = "${var.notejam_db_password}"
    vpc_security_group_ids = ["${aws_security_group.allow_internal.id}"]
}
