terraform {
  required_version = ">= 1.0.0"
}

resource "digitalocean_droplet" "w10k-deno" {
  image      = "ubuntu-22-10-x64"
  name       = "w10k-deno"
  region     = "nyc1"
  size       = "s-1vcpu-512mb"
  ssh_keys   = [data.digitalocean_ssh_key.do.id]
  monitoring = true

  connection {
    host        = self.ipv4_address
    user        = "root"
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install unzip",
      "curl -fsSL https://deno.land/x/install/install.sh | sh",
      "git clone https://github.com/david-wiles/w10k-deno.git"
    ]
  }
}

resource "digitalocean_domain" "default" {
  name       = format("k6client-%d.%s", count.index, var.domain)
  ip_address = digitalocean_droplet.w10k-deno[count.index].ipv4_address
}

