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

resource "aws_security_group" "allow_k8s_control_plane_node" {
  name        = "allow_k8s_control_plane_node"
  description = "Kubernetes control plane node"
  vpc_id      = aws_vpc.primary.id

  ingress {
    description = "Kubernetes API server"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "etcd server client API"
    from_port   = 2379
    to_port     = 2380
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Kubelet API"
    from_port   = 10250
    to_port     = 10250
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "kube-scheduler"
    from_port   = 10251
    to_port     = 10251
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "kube-controller-manager"
    from_port   = 10252
    to_port     = 10252
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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

resource "aws_security_group" "allow_k8s_worker_node" {
  name        = "allow_k8s_worker_node"
  description = "Kubernetes worker node"
  vpc_id      = aws_vpc.primary.id

  ingress {
    description = "Kubelet API"
    from_port   = 10250
    to_port     = 10250
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # [aws_vpc.primary.cidr_block]
  }

  ingress {
    description = "NodePort Services"
    from_port   = 30000
    to_port     = 32767
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
