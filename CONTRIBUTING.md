# Contributing to Campus Pay

First off, thank you for considering contributing to Campus Pay! It's people like you that make Campus Pay such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the Campus Pay Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots if applicable**
* **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List any alternatives you've considered**

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Ensure your code follows the project's coding standards
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

#### Pull Request Guidelines

* Keep pull requests focused on a single feature or fix
* Write clear, concise commit messages
* Include tests if applicable
* Update documentation as needed
* Ensure all tests pass
* Follow the existing code style

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm run install-all`
3. Create `.env` files in server and client directories (see README.md)
4. Start development servers: `npm run dev`

## Coding Standards

### TypeScript

* Use TypeScript for all new code
* Define proper types and interfaces
* Avoid using `any` type
* Use meaningful variable and function names

### React

* Use functional components with hooks
* Keep components small and focused
* Use proper prop typing
* Follow React best practices

### Backend

* Use async/await for asynchronous operations
* Implement proper error handling
* Add input validation for all endpoints
* Follow RESTful API conventions

### Git Commit Messages

* Use present tense ("Add feature" not "Added feature")
* Use imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit first line to 72 characters
* Reference issues and pull requests

Example:
```
Add payment receipt generation feature

- Implement PDF generation for payments
- Add email receipt functionality
- Update payment confirmation page
- Closes #123
```

## Project Structure

Follow the existing project structure:

```
server/src/
├── routes/        # API endpoints
├── models/        # Data models
├── middleware/    # Express middleware
├── utils/         # Utility functions
└── types/         # TypeScript types

client/src/
├── components/    # Reusable components
├── pages/         # Page components
├── contexts/      # React contexts
├── services/      # API services
└── types/         # TypeScript types
```

## Testing

* Write tests for new features
* Ensure existing tests pass
* Aim for meaningful test coverage
* Follow the testing guide in TESTING.md

## Documentation

* Update README.md for significant changes
* Add JSDoc comments for functions
* Update API documentation for endpoint changes
* Include examples in documentation

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
