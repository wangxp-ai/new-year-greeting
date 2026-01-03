const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// 配置参数
const config = {
    particleCount: 100,
    connectionDistance: 150,
    mouseDistance: 200,
    colors: ['#FFD700', '#FF4500', '#FFFFFF']
};

// 初始化画布尺寸
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// 粒子类
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // 边界反弹
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // 鼠标互动
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (config.mouseDistance - distance) / config.mouseDistance;
            
            // 轻轻排斥，产生流动感
            this.vx -= forceDirectionX * force * 0.05;
            this.vy -= forceDirectionY * force * 0.05;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// 初始化粒子
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// 绘制连线
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                const opacity = 1 - (distance / config.connectionDistance);
                ctx.strokeStyle = `rgba(255, 69, 0, ${opacity * 0.2})`; // 使用淡红色连线
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    drawConnections();
    requestAnimationFrame(animate);
}

// 鼠标位置追踪
const mouse = { x: undefined, y: undefined };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', () => {
    resize();
    initParticles();
});

// 启动
resize();
initParticles();
animate();
