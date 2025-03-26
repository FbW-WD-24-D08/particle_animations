const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'white';
console.log(ctx);
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient; // instead of line 26
ctx.strokeStyle = 'white';

// ctx.fillStyle = 'white';
// ctx.fillRect(150, 150, 150, 200);

class Particle{
    constructor(effect){
        this.effect = effect;
        this.radius = Math.random() * 10 + 5;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 1 - 0,5; // v stands for velocity, and one px per animation frame
        this.vy = Math.random() * 1 - 0,5; // y for y-axsis
    }
    draw(context){
        // context.fillStyle = 'hsl(' + this.x * 0.5 + ' , 100%, 50%)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }
    update(){
        this.x += this.vx;
        if(this.x > this.effect.width - this.radius || this.x < 0) this.vx *= -1; // let'em bounce on x-axisi

        this.y += this.vy;
        if(this.y > this.effect.height - this.radius || this.y < 0) this.vy *= -1; // let'em bounce on y-axisi
    };
};

class Effect{
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 275;
        this.createParticles();
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context){
        this.connectParticles(context)
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context){
        const maxDistance = 100;
        for (let i = 0; i < this.particles.length; i++){
            for (let j = i; j < this.particles.length; j++){
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.hypot(dx, dy); // Pythargoras Theorem Formula Of Distance: Squareroot of dx² + dy² // C² = A² + B²
                if(distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[i].x, this.particles[i].y);
                    context.lineTo(this.particles[j].x, this.particles[j].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    };
};
const effect = new Effect(canvas);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
};
animate();