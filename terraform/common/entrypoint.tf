terraform {
  required_version = "= 0.12.26"
  backend "s3" {}
}

provider "aws" {
  profile = "personal"
  region  = var.region
}

resource "aws_vpc" "primary" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Project     = "primary"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}

resource "aws_internet_gateway" "primary" {
  vpc_id = aws_vpc.primary.id
}

resource "aws_vpc_endpoint" "ec2" {
  vpc_id            = aws_vpc.primary.id
  service_name      = "com.amazonaws.${var.region}.ec2"
  vpc_endpoint_type = "Interface"
  security_group_ids = [
    aws_default_security_group.default.id,
    aws_security_group.allow_ssh.id,
    aws_security_group.allow_tls.id
  ]
  subnet_ids = [aws_subnet.app.id]

  tags = {
    Project     = "primary"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}

resource "aws_default_route_table" "primary" {
  default_route_table_id = aws_vpc.primary.default_route_table_id

  tags = {
    Project     = "primary"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}

resource "aws_route" "route_1" {
  route_table_id         = aws_default_route_table.primary.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.primary.id
  depends_on             = [aws_default_route_table.primary]
}

resource "aws_default_security_group" "default" {
  vpc_id = aws_vpc.primary.id

  ingress {
    protocol  = -1
    self      = true
    from_port = 0
    to_port   = 0
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "allow_tls" {
  name        = "allow_tls"
  description = "Allow TLS inbound traffic"
  vpc_id      = aws_vpc.primary.id

  ingress {
    description = "TLS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # [aws_vpc.primary.cidr_block]
  }

  ingress {
    description = "TLS from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # [aws_vpc.primary.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Project     = "primary"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.primary.id

  ingress {
    description = "SSH from VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # [aws_vpc.primary.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Project     = "primary"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}
