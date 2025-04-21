import React from 'react';

const Footer = () => {
    return (
        <footer className="py-6 ">
            <div className="container mx-auto">
                <nav className="flex justify-center space-x-8">
                    <a href="/" className="text-red-500/70 hover:text-red-600/90 transition-colors">
                        Home
                    </a>
                    <a href="/vitamins" className="text-red-500/70 hover:text-red-600/90 transition-colors">
                        All Vitamins
                    </a>
                    <a href="/about" className="text-red-500/70 hover:text-red-600/90 transition-colors">
                        About
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-red-500/70 hover:text-red-600/90 transition-colors">
                        Instagram
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-red-500/70 hover:text-red-600/90 transition-colors">
                        Facebook
                    </a>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;