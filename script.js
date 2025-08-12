document.addEventListener('DOMContentLoaded', function() {
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a smooth transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });

    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active navigation link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Enhanced typing animation
    const typeWriter = {
        words: [
            'Python Enthusiast', 
            'AI & ML Student',
            'Problem Solver',
            'Tech Innovator',
            'Frontend Developer'
        ],
        currentWordIndex: 0,
        currentCharIndex: 0,
        isDeleting: false,
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseTime: 2000,
        
        init() {
            this.element = document.querySelector('.typing-text');
            this.type();
        },
        
        type() {
            const currentWord = this.words[this.currentWordIndex];
            
            if (this.isDeleting) {
                this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
            } else {
                this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
            }
            
            let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
            
            if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
                typeSpeed = this.pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            }
            
            setTimeout(() => this.type(), typeSpeed);
        }
    };
    
    typeWriter.init();
    
    // Animated counters
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = current.toFixed(2);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target.toString();
                }
            };
            
            updateCounter();
        });
    };
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation for stats section
                if (entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in-up');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--accent-primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px var(--shadow-color);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Make showNotification globally accessible
    window.showNotification = showNotification;
    
    // Enhanced skill items hover effects
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Parallax effect for hero section
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        
        if (heroSection) {
            const rate = scrolled * -0.1;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-gradient);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        box-shadow: 0 8px 25px rgba(0, 212, 170, 0.3);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.style.transform = 'translateY(0)';
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.transform = 'translateY(100px)';
            scrollTopBtn.style.opacity = '0';
        }
    });
    
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'translateY(-3px)';
        scrollTopBtn.style.boxShadow = '0 12px 35px rgba(0, 212, 170, 0.4)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'translateY(0)';
        scrollTopBtn.style.boxShadow = '0 8px 25px rgba(0, 212, 170, 0.3)';
    });

    // Resume Functions
    function downloadResume() {
        // In a real implementation, you would link to your actual resume file
        showNotification('Resume download will be available soon!', 'info');
    }

    function viewResume() {
        // In a real implementation, you would open your resume in a new tab
        showNotification('Resume viewer will be available soon!', 'info');
    }
});
