resource "aws_subnet" "app" {
  vpc_id                  = aws_vpc.primary.id
  cidr_block              = "10.0.8.0/24"
  availability_zone       = var.az
  map_public_ip_on_launch = true

  tags = {
    Project     = "mean-demo"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}

resource "aws_network_interface" "app" {
  subnet_id = aws_subnet.app.id
  security_groups = [
    aws_default_security_group.default.id,
    aws_security_group.allow_tls.id,
    aws_security_group.allow_ssh.id
  ]

  attachment {
    instance     = aws_instance.app.id
    device_index = 1
  }

  tags = {
    Project     = "mean-demo"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}

resource "aws_network_acl" "app" {
  vpc_id = aws_vpc.primary.id

  egress {
    protocol   = "tcp"
    rule_no    = 200
    action     = "allow"
    cidr_block = aws_subnet.app.cidr_block
    from_port  = 443
    to_port    = 443
  }

  ingress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = aws_subnet.app.cidr_block
    from_port  = 80
    to_port    = 80
  }

  tags = {
    Project     = "mean-demo"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}

resource "aws_instance" "app" {
  ami                         = var.ami_id
  instance_type               = "t3a.medium"
  associate_public_ip_address = true
  subnet_id                   = aws_subnet.app.id
  key_name                    = "personal-key"
  depends_on                  = [aws_internet_gateway.primary]
  vpc_security_group_ids = [
    aws_default_security_group.default.id,
    aws_security_group.allow_ssh.id,
    aws_security_group.allow_tls.id,
    aws_security_group.allow_k8s_worker_node.id,
    aws_security_group.allow_k8s_control_plane_node.id
  ]

  root_block_device {
    delete_on_termination = true
    encrypted             = true
    volume_size           = 8
    volume_type           = "gp2"
  }

  ebs_block_device {
    device_name = "/dev/sdf"
    volume_type = "gp2"
    volume_size = 8
    encrypted   = true
  }

  tags = {
    Project     = "mean-demo"
    Environment = var.environment
    Owner       = "jrcasso"
  }
}
