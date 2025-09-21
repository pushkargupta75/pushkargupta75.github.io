document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your Public Key
    // IMPORTANT: Replace "YOUR_PUBLIC_KEY" with your actual key from the EmailJS dashboard.
    // The key "7EUxus6f5fQ7ZAv26" is used for illustration.
    emailjs.init({ publicKey: "7EUxus6f5fQ7ZAv26" });

    // Element Selectors
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const typingTextElement = document.querySelector('.typing-text');
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateElements = document.querySelectorAll('.fade-in-up');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const contactForm = document.getElementById('contact-form');
    const skillItems = document.querySelectorAll('.skill-item');
    
    // --- Theme Management ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => { body.style.transition = ''; }, 300);
    });

    // --- Mobile Navigation ---
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // --- Navbar Scroll Effect & Active Link ---
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

    // --- Typing Animation Class ---
    class TypeWriter {
        constructor(element, words) {
            this.element = element;
            this.words = words;
            this.currentWordIndex = 0;
            this.currentCharIndex = 0;
            this.isDeleting = false;
            this.typeSpeed = 100;
            this.deleteSpeed = 50;
            this.pauseTime = 2000;
            this.type();
        }
        
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
    }
    
    new TypeWriter(typingTextElement, [
        'Python Enthusiast', 
        'AI & ML Student',
        'Problem Solver',
        'Tech Innovator',
        'Frontend Developer',
        'Data Science Learner'
    ]);

    // --- Animated Counters ---
    const animateCounters = () => {
        statNumbers.forEach(counter => {
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

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => observer.observe(el));

    // --- Smooth Scrolling ---
    smoothScrollLinks.forEach(anchor => {
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

    // --- Contact Form with EmailJS ---
    document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Template parameters for notification email (to you)
    const notificationParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: 'pushkargupta993@gmail.com'
    };
    
    // Template parameters for auto-reply email (to sender)
    const autoReplyParams = {
        to_name: name,
        to_email: email,
        subject: subject,
        original_message: message,
        reply_message: `Hi ${name},\n\nThank you for reaching out! I've received your message about "${subject}" and will get back to you as soon as possible.\n\nBest regards,\nPushkar Gupta`
    };

    // Send both emails simultaneously
    Promise.all([
        // Send notification to you
        emailjs.send('service_vge7po1', 'template_8x4ija9', notificationParams),
        // Send auto-reply to sender
        emailjs.send('service_vge7po1', 'template_uwx63v8', autoReplyParams)
    ])
    .then(function(responses) {
        console.log('Both emails sent successfully:', responses);
        showNotification('Message sent successfully! Check your email for confirmation. I\'ll get back to you soon!', 'success');
        document.getElementById('contact-form').reset();
    })
    .catch(function(error) {
        console.error('EmailJS error:', error);
        showNotification('Failed to send message. Please try again or email me directly.', 'error');
    })
    .finally(function() {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

// Notification function (keep your existing showNotification function or use this enhanced version)
function showNotification(message, type = 'info') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification-custom');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#f59e0b'
    };
    
    notification.className = 'notification-custom';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
    
    // Notification Function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#f59e0b'
        };
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
        `;
        notification.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // --- Skill Items Hover Effects ---
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

    // --- Parallax Effect ---
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

    // --- Scroll to Top Button ---
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
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        scrollTopBtn.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.4)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'translateY(0)';
        scrollTopBtn.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
    });
});