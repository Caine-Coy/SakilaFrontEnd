import './About.css';

function About() {
    const technologies = [
        { name: "React", description: "A JavaScript library for building user interfaces" },
        { name: "TypeScript", description: "Typed JavaScript for better development experience" },
        { name: "Vite", description: "Next generation frontend tooling" },
        { name: "OpenAI SDK", description: "To communicate with a local LLM" },
        { name: "LM Studio", description: "Local LLM integration for AI features" },
        { name: "React Icons", description: "Popular icons in React projects" },
    ];

    return (
        <div className="about-container">
            <h1>About</h1>
            <p>This is a movie database website by Joseph Benson</p>
            
            <div className="tech-section">
                <h2>Built With</h2>
                <div className="tech-grid">
                    {technologies.map((tech, index) => (
                        <div key={index} className="tech-card">
                            <h3>{tech.name}</h3>
                            <p>{tech.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;