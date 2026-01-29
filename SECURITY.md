# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within React PhaJay, please report it through our official channels:

- **GitHub Issues**: [GitHub Issues](https://github.com/phajay/react-phajay/issues) (for non-sensitive issues)
- **PhaJay Portal**: Contact through [PhaJay Portal](https://portal.phajay.co) for security-related concerns

Please do **not** report sensitive security vulnerabilities through public GitHub issues.

### What to Include

When reporting a vulnerability, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes (if you have them)

### Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Within 7 days
- **Resolution**: Within 30 days (for critical vulnerabilities)

## Security Considerations

### API Keys and Secrets

- Never commit API keys or secrets to version control
- Store sensitive information in environment variables 
- Use different keys for development and production
- Secret keys are used for Basic Authentication via base64 encoding
- Payment QR service uses `secretKey` header for authentication

### Payment Data

- This SDK does not store or process sensitive payment data locally
- All payment processing is handled securely by PhaJay's servers
- Credit card payments require KYC-approved accounts
- All credit card transactions use 3D Secure (3DS) authentication
- Follow PCI DSS guidelines when handling payment information

### HTTPS Requirements

- Always use HTTPS in production environments
- PhaJay Gateway API requires HTTPS for all payment processing
- Default API endpoint uses HTTPS: `https://payment-gateway.phajay.co/v1/api`

### WebSocket Security

- Real-time payment subscriptions use SocketIO connections
- Connection channels are tied to specific secret keys using `join::${secretKey}` pattern
- Automatic disconnection after payment completion or timeout
- Demo mode fallback when WebSocket connection fails

## Best Practices

1. **Keep Dependencies Updated**: Regularly update React PhaJay and its dependencies
2. **Environment Separation**: Use separate API keys for different environments
3. **Error Handling**: Implement proper error handling to avoid information disclosure using `PhaJayAPIError`
4. **Logging**: Avoid logging sensitive information in production
5. **Validation**: Always validate payment responses on your server using webhook validation
6. **React Provider**: Use `PhaJayProvider` with `config={{ secretKey: "your-secret-key" }}` pattern
7. **TypeScript**: Leverage TypeScript types for compile-time safety

## Contact

For security-related questions or concerns:
- **Documentation**: [https://payment-doc.phajay.co/v1](https://payment-doc.phajay.co/v1)
- **Portal**: [https://portal.phajay.co](https://portal.phajay.co)
- **GitHub Issues**: [https://github.com/phajay/react-phajay/issues](https://github.com/phajay/react-phajay/issues)
