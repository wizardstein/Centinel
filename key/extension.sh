# Create private key called key.pem
# 2>/dev/null openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem

# Generate string to be used as "key" in manifest.json (outputs to stdout)
printf "Manifest key: \n"
2>/dev/null openssl rsa -in key.pem -pubout -outform DER | openssl base64 -A

# Calculate extension ID (outputs to stdout)
# need to install sha256sum
# brew install coreutils
printf "\n\nExtension ID: \n"
2>/dev/null openssl rsa -in key.pem -pubout -outform DER | sha256sum | head -c32 | tr 0-9a-f a-p
printf "\n"
