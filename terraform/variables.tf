variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "notejam_db_user" {}
variable "notejam_db_password" {}
variable "key_pair_name" {}
variable "aws_region" {
    default = "us-east-2"
}

variable "instance_name" {
    default = "notejam"
}

variable "instance_type" {
    default = "t2.micro"
}

variable "ami_id" {
    default = "ami-1de2b978"
}

variable "number_of_instances" {
    default = 1
}

variable "user_data" {
    default = "./user-data"
}
