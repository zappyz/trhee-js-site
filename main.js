import * as THREE from 'three';

let isSphereFormed = false;
let targetPositions = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
            },500); // Adjust delay as needed
        }
    }
}

// Prevent Ctrl + 0 and Ctrl + - from zooming in and out
window.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === '0' || event.key === '-')) {
        event.preventDefault();
    }
});

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

animate();
