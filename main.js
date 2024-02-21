import * as THREE from 'three';

let isAnimating = false; // New variable to track animation state
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle parameters
const particleCount = 1000;
const particlePositions = new Float32Array(particleCount * 3); // Buffer for particle positions
const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff });

// Generate random particles
for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = Math.random() * 2000 - 1000;
    particlePositions[i3 + 1] = Math.random() * 2000 - 1000;
    particlePositions[i3 + 2] = Math.random() * 2000 - 1000;
}

// Particle system
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

// Camera setup
camera.position.z = 300;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (!isAnimating) {
        particleSystem.rotation.y += 0.01; // Rotate the particle system
    }
}

animate();

// Event listener for wheel events
document.addEventListener('wheel', handleScroll, { passive: false });

// Event listeners for touch events
document.addEventListener('touchstart', onTouchStart);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchend', onTouchEnd);

let isSphereFormed = false;
let targetPositions = null;

function handleScroll(event) {
    event.preventDefault(); // Prevent default scroll behavior

    let deltaY = event.deltaY || event.deltaX;

    if (event.touches && event.touches.length > 0) {
        deltaY = -(event.touches[0].clientY - previousMousePosition.y);
    }

    if (deltaY > 0 && window.scrollY === 0) {
        if (!isSphereFormed) {
            targetPositions = calculateSpherePositions();
            animateParticlesToSphere();
            isAnimating = true;
            isSphereFormed = true;
        }
    } else if (deltaY < 0) {
        if (isSphereFormed) {
            targetPositions = particlePositions.slice(); // Reset to original positions
            scatterParticles();
            isAnimating = false;
            isSphereFormed = false;
        }
    }
}


// Function to calculate target positions forming a sphere
function calculateSpherePositions() {
    const targetSphere = new THREE.SphereGeometry(100, 32, 32); // Define target sphere geometry
    return targetSphere.attributes.position.array; // Get target sphere positions
}

// Function to animate particles forming a sphere
function animateParticlesToSphere() {
    const duration = 2000; // Animation duration in milliseconds
    const startTime = Date.now();

    function updateParticles() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Clamp progress to 1

        for (let i = 0; i < particleCount * 3; i++) {
            particlePositions[i] += (targetPositions[i] - particlePositions[i]) * progress;
        }

        particleGeometry.attributes.position.needsUpdate = true; // Update particle positions

        if (progress < 1) {
            requestAnimationFrame(updateParticles); // Continue animation if not finished
        }
    }

    updateParticles(); // Start the animation
}

// Function to scatter particles
function scatterParticles() {
    const duration = 2000; // Animation duration in milliseconds
    const startTime = Date.now();

    function updateParticles() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Clamp progress to 1

        for (let i = 0; i < particleCount * 3; i++) {
            particlePositions[i] += (targetPositions[i] - particlePositions[i]) * progress;
        }

        particleGeometry.attributes.position.needsUpdate = true; // Update particle positions

        if (progress < 1) {
            requestAnimationFrame(updateParticles); // Continue animation if not finished
        }
    }

    updateParticles(); // Start the animation
}

function onTouchStart(event) {
    event.preventDefault();
    isDragging = true;
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
    if (event.touches.length > 1) {
        // Handle multitouch
        // Additional logic for multitouch if needed
    }
}

function onTouchMove(event) {
    event.preventDefault();
    if (!isDragging) return;

    const deltaMove = {
        x: event.touches[0].clientX - previousMousePosition.x,
        y: event.touches[0].clientY - previousMousePosition.y
    };

    if (Math.abs(deltaMove.x) > Math.abs(deltaMove.y)) {
        camera.position.x += deltaMove.x * 0.1;
    } else {
        camera.position.y -= deltaMove.y * 0.1;
    }

    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
}

function onTouchEnd(event) {
    event.preventDefault();
    isDragging = false;
}
