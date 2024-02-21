import * as THREE from 'three';

let isSphereFormed = false; // Initialize isSphereFormed
let targetPositions = null; // Initialize targetPositions

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle parameters
const particleCount = 100000; // Increase the number of particles
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

    // Always rotate the particle system
    particleSystem.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
}

// Event listener for wheel events
document.addEventListener('wheel', handleScroll, { passive: false });

function handleScroll(event) {
    event.preventDefault(); // Prevent default scroll behavior

    let deltaY = event.deltaY || event.deltaX;

    // Only trigger the animation when scrolling down and the sphere is not formed
    if (deltaY > 0 && window.scrollY === 0 && !isSphereFormed) {
        targetPositions = calculateSpherePositions();
        particleMaterial.color.set(0xff0000); // Set color to red immediately
        animateParticlesToSphere();
        isSphereFormed = true;
    }
}

// Function to calculate target positions forming a sphere
function calculateSpherePositions() {
    const targetSphere = new THREE.SphereGeometry(100, 64, 64); // Increase segments to 64
    return targetSphere.attributes.position.array; // Get target sphere positions
}

// Function to animate particles forming a sphere
function animateParticlesToSphere() {
    // Set color to red immediately
    particleMaterial.color.set(0xff0000);

    const duration = 2000; // Animation duration in milliseconds
    const halfwayTime = duration / 2; // Time to halfway point
    const startTime = Date.now();

    function updateParticles() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Clamp progress to 1

        // Update particle positions
        for (let i = 0; i < particleCount * 3; i++) {
            particlePositions[i] += (targetPositions[i] - particlePositions[i]) * progress;
        }

        // Update particle colors directly to red
        particleMaterial.color.set(0xff0000);

        particleGeometry.attributes.position.needsUpdate = true; // Update particle positions
        particleMaterial.needsUpdate = true; // Update particle material

        if (progress < 1) {
            requestAnimationFrame(updateParticles); // Continue animation if not finished
        }
    }

    updateParticles(); // Start the animation
}

// Start the animation loop
animate();
