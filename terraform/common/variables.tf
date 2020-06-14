variable "az" {
  type        = string
  description = "AWS Availability Zone"
}

variable "ami_id" {
  type        = string
  description = "AWS Marketplace AMI ID"
}

variable "environment" {
  type        = string
  description = "Infrastructural environment: dev/stage/production"
}

variable "region" {
  type        = string
  description = "AWS Region"
}
