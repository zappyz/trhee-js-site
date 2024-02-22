import * as THREE from 'three';

let isSphereFormed = false;
let targetPositions = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 100, 50); // Adjust position as needed
scene.add(directionalLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Adjust intensity as needed
scene.add(ambientLight);

const particleCount = 100000;
const particlePositions = new Float32Array(particleCount * 3);
const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff });

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = Math.random() * 2000 - 1000;
    particlePositions[i3 + 1] = Math.random() * 2000 - 1000;
    particlePositions[i3 + 2] = Math.random() * 2000 - 1000;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

camera.position.z = 300;

function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.002; // rotation speed particles
    camera.position.y = -window.scrollY * 0.1;
    renderer.render(scene, camera);
}

// Handle scroll event to trigger sphere formation
document.addEventListener('wheel', handleScroll, { passive: false });

function handleScroll(event) {
    event.preventDefault();
    let deltaY = event.deltaY || event.deltaX;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (deltaY > 0) {
        if (window.scrollY === 0 && !isSphereFormed) {
            targetPositions = calculateSpherePositions();
            particleMaterial.color.set(0xff0000);
            animateParticlesToSphere();
            isSphereFormed = true;

            setTimeout(() => {
                createNeonTitle();
                setTimeout(() => {
                    showNavbarWithTransition(); // Show the navbar with transition after the sphere formation
                }, 500); // Adjust delay as needed
            }, 500); // Adjust delay as needed
        }
    }
}

function showNavbarWithTransition() {
    const navbar = document.getElementById('navbar');
    navbar.style.transitionDelay = '0.5s'; // Delay before transition starts
    navbar.classList.add('show'); // Add class to trigger transition
}

function createNeonTitle() {
    const titleText = "卂卩卩ㄥ乇卩丨乇丂ㄚ";
    const titleElement = document.createElement('div');
    titleElement.textContent = titleText;
    titleElement.classList.add('neon-title');
    document.body.appendChild(titleElement);

    // Get the color of the neon text
    const neonTextColor = window.getComputedStyle(titleElement).color;

    // Set the color of the sphere material to match the neon text color
    particleMaterial.color.setStyle(neonTextColor);

    // Animate the entrance of the title
    setTimeout(() => {
        titleElement.style.opacity = '1';
        titleElement.style.transform = 'translateY(-50%) scale(1)';
    }, 500); // Adjust animation delay as needed
}

function calculateSpherePositions() {
    const targetSphere = new THREE.SphereGeometry(100, 64, 64);
    return targetSphere.attributes.position.array;
}

function animateParticlesToSphere() {
    particleMaterial.color.set(0xff0000);

    const duration = 2000;
    const startTime = Date.now();

    function updateParticles() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const interpolationFactor = 0.1;

        for (let i = 0; i < particleCount * 3; i++) {
            particlePositions[i] += (targetPositions[i] - particlePositions[i]) * progress * interpolationFactor;
        }

        particleMaterial.color.set(0xff0000);

        particleGeometry.attributes.position.needsUpdate = true;
        particleMaterial.needsUpdate = true;

        if (progress < 1) {
            requestAnimationFrame(updateParticles);
        }
    }

    updateParticles();
}

function createSidePanels() {
    // Get the height of the navbar
    const navbarHeight = document.getElementById('navbar').offsetHeight;

    // Create left panel
    const leftPanel = document.createElement('div');
    leftPanel.id = 'leftPanel';
    leftPanel.classList.add('side-panel', 'breathing-glow'); // Apply breathing glow effect
    leftPanel.style.left = '0';
    leftPanel.style.top = navbarHeight + 'px'; // Position below the navbar

    // Add hover effect using JavaScript
    leftPanel.addEventListener('mouseenter', function() {
        this.classList.add('hovered');
    });

    leftPanel.addEventListener('mouseleave', function() {
        this.classList.remove('hovered');
    });

    // Bootstrap "About Me" section
    leftPanel.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h2>About Me</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed lorem et nisi dignissim tristique. Sed quis sapien vitae risus congue vehicula. Sed eu est vel enim dignissim lacinia. Phasellus nec faucibus quam. Curabitur ac dolor et odio finibus commodo ac ut libero.</p>
                    <p>Donec eu scelerisque justo. Curabitur non augue vel ipsum laoreet fermentum. Sed nec eros tellus. Duis eget magna vitae risus gravida vestibulum. Ut ac mi a eros porttitor rhoncus. Sed sed ultricies quam, vitae varius felis. Vivamus id tincidunt ex. Fusce ac odio nec purus consectetur mollis non nec lectus.</p>
                    <p>Nunc ultrices elit at nulla sodales, a vestibulum nulla ultricies. Nam nec nunc ut leo facilisis condimentum. Curabitur nec rhoncus mauris. Proin in dui sit amet odio feugiat finibus. Ut aliquam mi eu est blandit hendrerit.</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(leftPanel);

    // Create right panel
    const rightPanel = document.createElement('div');
    rightPanel.id = 'rightPanel';
    rightPanel.classList.add('side-panel', 'breathing-glow', 'repository-panel'); // Apply breathing glow effect and repository panel style
    rightPanel.style.right = '0';
    rightPanel.style.top = navbarHeight + 'px'; // Position below the navbar

    // Add hover effect using JavaScript
    rightPanel.addEventListener('mouseenter', function() {
        this.classList.add('hovered');
    });

    rightPanel.addEventListener('mouseleave', function() {
        this.classList.remove('hovered');
    });

    // Fetch GitHub repositories using the GitHub API
    fetch('https://api.github.com/users/zappyz/repos')
        .then(response => response.json())
        .then(data => {
            // Render repositories on the page
            const repositoriesContainer = document.createElement('div');
            repositoriesContainer.id = 'repositories';
            data.forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.classList.add('repository');
                repoElement.innerHTML = `
                    <h2>Projects</h2>
                    <h1 class="repo-name">${repo.name}</h1>
                    <p class="repo-description">${repo.description || 'No description available'}</p>
                    <p class="repo-link"><a href="${repo.html_url}" target="_blank">View on GitHub</a></p>
                `;
                repositoriesContainer.appendChild(repoElement);
            });
            rightPanel.appendChild(repositoriesContainer);
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
        });

    document.body.appendChild(rightPanel);
}




// Add event listener to the "About" section in the navbar
document.querySelector('.navbar ul li:nth-child(2) a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    createSidePanels(); // Load panels when "About" section is clicked
    setTimeout(showSidePanels, 1000); // Delay the fade-in animation to ensure panels are loaded
});

function showSidePanels() {
    const sidePanels = document.querySelectorAll('.side-panel');
    sidePanels.forEach(panel => {
        panel.style.transition = 'opacity 1s ease-in-out'; // Add transition for opacity
        panel.style.opacity = '1'; // Set opacity to 1 to trigger fade-in animation
    });
}



document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to navbar items
    document.querySelectorAll('.navbar ul li a').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor link behavior
            const panelId = this.getAttribute('href').substring(1); // Get the panel ID from the href attribute
            const panel = document.getElementById(panelId); // Get the corresponding panel element
            const panels = document.querySelectorAll('.side-panel'); // Get all side panels
            panels.forEach(p => p.classList.remove('hovered')); // Remove 'hovered' class from all panels
            if (panel) {
                panel.classList.add('hovered'); // Add the 'hovered' class to trigger the hover effect
            }
            if (panelId === 'home') {
                removeSidePanels(); // Remove side panels if Home button is clicked
            }
        });
    });
});

function removeSidePanels() {
    const sidePanels = document.querySelectorAll('.side-panel');
    sidePanels.forEach(panel => {
        panel.parentNode.removeChild(panel);
    });
}


animate();