function isStrongPassword(password) {
    // Check if password length is at least 8 characters
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    // Regular expressions to check if password contains required characters
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;

    // Check if password contains at least one lowercase letter
    if (!lowerCaseRegex.test(password)) {
        return "Password must contain at least one lowercase letter";
    }

    // Check if password contains at least one uppercase letter
    if (!upperCaseRegex.test(password)) {
        return "Password must contain at least one uppercase letter";
    }

    // Check if password contains at least one digit
    if (!digitRegex.test(password)) {
        return "Password must contain at least one digit";
    }

    // Check if password contains at least one special character
    if (!specialCharRegex.test(password)) {
        return "Password must contain at least one special character";
    }

    // If all conditions pass, password is strong
    return true;
}


function validateEmail(email) {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
}

function isValidUsername(inputString) {
    if (inputString.length < 4) {
        return "Username must be at least 4 characters long";
    }
    if (inputString.length > 20) {
        return "Username must be at most 20 characters long";
    }
    // Check if the string starts or ends with "-"
    if (inputString.startsWith('-') || inputString.endsWith('-')) {
        return "Username cannot start or end with '-'";
    }
    // Check if the string contains spaces, special characters (except "-"), or capital letters
    if (/[\sA-Z!@#$%^&*()_+={}[\]:;<>,.?~\\\/]/.test(inputString)) {
        return "Username can only contain lowercase letters, numbers, and hyphens";
    }
    // Check if the string starts with a number
    if (/^\d/.test(inputString)) {
        return "Username cannot start with a number";
    }
    // If all conditions are met, return true
    return true;
}

const technologyUsed = [{
    id:1,
    title:"MongoDB",
    description:"A document-oriented NoSQL database used for high volume data storage.",
    image:"1721191066317.jpeg",
    slug:"https://www.mongodb.com"
},
{
    id:2,
    title:"Express",
    description:"A fast, unopinionated, minimalist web framework for Node.js.",
    image:"1_t40l2rOzSEXZbvGWClW-Pw.jpg",
    slug:"https://expressjs.com"
},
{
    id:3,
    title:"React",
    description:"A JavaScript library for building user interfaces.",
    image:"1_7VFewln8nrykeF7kQyXwLg.jpg",
    slug:"https://react.dev"
},
{
    id:4,
    title:"Node.js",
    description:"A JavaScript runtime built on Chrome's V8 JavaScript engine.",
    image:"1_wHKmHfVWNwSO1v4uJR8U7w.jpg",
    slug:"https://nodejs.org"
},
{
    id:5,
    title:"Shadcn UI",
    description:"A component library for React and Next.js applications.",
    image:"cover.png",
    slug:"https://ui.shadcn.com/"
},
{
    id:6,
    title:"Amazon Web Services",
    description:"A subsidiary of Amazon providing on-demand cloud computing platforms and APIs.",
    image:"/Aws Elemental Perfecting The Media Experience.jpg",
    slug:"https://aws.amazon.com"
}
]

export { isStrongPassword, validateEmail, isValidUsername,technologyUsed };