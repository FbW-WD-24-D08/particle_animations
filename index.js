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
ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';

// ctx.fillStyle = 'white';
// ctx.fillRect(150, 150, 150, 200);

class Particle{
    constructor(effect){
        this.effect = effect;
        this.radius = Math.random() * 10 + 5;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 2 - 0.5; // v stands for velocity, and one px per animation frame
        this.vy = Math.random() * 2 - 0.5; // y for y-axsis
    }
    draw(context){
        // context.fillStyle = 'hsl(' + this.x * 0.5 + ' , 100%, 50%)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }
    update(){
        if(this.effect.mouse.pressed){
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            const force = this.effect.mouse.radius / distance;
            if(distance < this.effect.mouse.radius){
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle);
                this.y += Math.sin(angle);
            }
        }
        if(this.x < this.radius){
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x > this.effect.width - this.radius){
                this.x = this.effect.width - this.radius;
                this.vx *= -1;
        }
        if(this.y < this.radius){
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y > this.effect.height - this.radius){
                this.y = this.effect.height - this.radius;
                this.vy *= -1;
        }

        /*this.x += this.vx;
        if(this.x > this.effect.width - this.radius || this.x < 0) this.vx *= -1; // let'em bounce on x-axisi

        this.y += this.vy;
        if(this.y > this.effect.height - this.radius || this.y < 0) this.vy *= -1;  */ // let'em bounce on y-axisi

        this.x += this.vx;
        this.y += this.vy;

    }
    reset(){
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
};

class Effect{
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 275;
        this.createParticles();

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 200
        }

        window.addEventListener('resize', e => {        // parent-scope needed
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
        });
        window.addEventListener('mousemove', e => {
            if(this.mouse.pressed){
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;

        });
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
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = this.context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'magenta');
        gradient.addColorStop(1, 'blue');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        });
    };
};
const effect = new Effect(canvas, ctx);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
};
animate();