// trigger to play music in the background with sweetalert
window.addEventListener('load', () => {
    Swal.fire({
        title: 'Shall we play some music? 🎶',
        text: "It makes the moment magical! ✨",
        imageUrl: 'img/ballon1.svg',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Cute balloon',
        // icon: 'warning', // Removed warning icon
        background: '#fff0f5', // Lavender blush
        color: '#d63384',
        backdrop: `
            rgba(0,0,0,0.4)
        `,
        showCancelButton: true,
        confirmButtonColor: '#ff99c8',
        cancelButtonColor: '#b5838d',
        confirmButtonText: 'Yes please',
        cancelButtonText: 'No thanks',
        allowOutsideClick: false, // Prevent closing by clicking background
        allowEscapeKey: false,   // Prevent closing by Esc key
        allowEnterKey: false,    // Prevent accidental Enter
        customClass: {
            popup: 'cute-popup',
            title: 'cute-title',
        },
        didOpen: () => {
            // "Run away" Logic for Cancel Button
            const noBtn = Swal.getCancelButton();
            noBtn.addEventListener('mouseover', () => {
                // Calculate random position offsets
                const x = (Math.random() - 0.5) * 300; // +/- 150px
                const y = (Math.random() - 0.5) * 300;
                noBtn.style.transform = `translate(${x}px, ${y}px)`;
                noBtn.style.transition = "transform 0.2s ease-out";
            });
            // Also try to prevent click if they manage to reach it
            noBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Move again just in case
                const x = (Math.random() - 0.5) * 300;
                const y = (Math.random() - 0.5) * 300;
                noBtn.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // NUCLEAR OPTION: Manually remove the element
            const swalContainer = document.querySelector('.swal2-container');
            if (swalContainer) {
                swalContainer.remove(); // Bye bye
            }
            // Fallback: Remove class from body if it stuck
            document.body.classList.remove('swal2-shown', 'swal2-height-auto');

            try {
                // Play audio safely
                document.querySelector('.song').play().catch(err => {
                    console.warn("Audio play failed automatically:", err);
                });
            } catch (e) {
                console.warn("Audio play error:", e);
            }
            // Start animation after a tiny delay to ensure modal is gone
            setTimeout(animationTimeline, 200);
        } else {
            Swal.close();
            setTimeout(animationTimeline, 200);
        }
    });
});


// animation timeline
const animationTimeline = () => {
    // split chars that needs to be animated individually
    const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0]; // Hidden main text
    const hbd = document.getElementsByClassName("wish-hbd")[0];

    // Reset Chatbox text was mostly for the old cursor effect, now we use it as source
    // Sanitize text: replace newlines and multiple spaces with a single space
    const originalText = textBoxChars.innerText.replace(/\s+/g, " ").trim();

    hbd.innerHTML = `<span>${Array.from(hbd.innerHTML)
        .join("</span><span>")}</span>`;

    const ideaTextTrans = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
    }

    const ideaTextTransLeave = {
        opacity: 0,
        y: 20,
        rotationY: 5,
        skewX: "-15deg"
    }

    // timeline
    const tl = new TimelineMax();

    tl.to(".container", 0.6, {
        visibility: "visible"
    })
        .from(".one", 0.7, {
            opacity: 0,
            y: 10
        })
        .from(".two", 0.4, {
            opacity: 0,
            y: 10
        })
        .to(".one",
            0.7,
            {
                opacity: 0,
                y: 10
            },
            "+=3.5")
        .to(".two",
            0.7,
            {
                opacity: 0,
                y: 10
            },
            "-=1")
        .from(".three", 0.7, {
            opacity: 0,
            y: 10
        })
        .to(".three",
            0.7,
            {
                opacity: 0,
                y: 10
            },
            "+=3")
        .from(".four", 0.7, {
            scale: 0.2,
            opacity: 0,
        })
        .call(() => {
            // Pause timeline to type message
            tl.pause();
            const inputField = document.getElementById("typingInput");

            // Auto Type into Input
            typeWriterInput(inputField, originalText, 50, () => {
                // Auto Send after typing
                setTimeout(() => {
                    // Click send button programmatically or just run logic
                    document.getElementById("sendBtn").click();
                }, 500);
            });
        });
    // Removed old text appear logic, replaced with above custom call
    // .staggerTo...

    // Continue with post-send animations
    // Note: The timeline is resumed inside the click handler below
    tl.to(".fake-btn", 0.1, {
        backgroundColor: "rgb(127, 206, 248)",
    },
        "+=4")
        .to(
            ".four",
            0.5, {
            scale: 0.2,
            opacity: 0,
            y: -150
        },
            "+=1")
        .from(".idea-1", 0.7, ideaTextTrans)
        .to(".idea-1", 0.7, ideaTextTransLeave, "+=2.5")
        .from(".idea-2", 0.7, ideaTextTrans)
        .to(".idea-2", 0.7, ideaTextTransLeave, "+=2.5")
        .from(".idea-3", 0.7, ideaTextTrans)
        .to(".idea-3 strong", 0.5, {
            scale: 1.2,
            x: 10,
            backgroundColor: "rgb(21, 161, 237)",
            color: "#fff",
        })
        .to(".idea-3", 0.7, ideaTextTransLeave, "+=2.5")
        .from(".idea-4", 0.7, ideaTextTrans)
        .to(".idea-4", 0.7, ideaTextTransLeave, "+=2.5")
        .from(
            ".idea-5",
            0.7, {
            rotationX: 15,
            rotationZ: -10,
            skewY: "-5deg",
            y: 50,
            z: 10,
            opacity: 0,
        },
            "+=1.5"
        )
        .to(
            ".idea-5 span",
            0.7, {
            rotation: 90,
            x: 8,
        },
            "+=1.4"
        )
        .to(
            ".idea-5",
            0.7, {
            scale: 0.2,
            opacity: 0,
        },
            "+=2"
        )
        .staggerFrom(
            ".idea-6 span",
            0.8, {
            scale: 3,
            opacity: 0,
            rotation: 15,
            ease: Expo.easeOut,
        },
            0.2
        )
        .staggerTo(
            ".idea-6 span",
            0.8, {
            scale: 3,
            opacity: 0,
            rotation: -15,
            ease: Expo.easeOut,
        },
            0.2,
            "+=1.5"
        )
        .staggerFromTo(
            ".baloons img",
            2.5, {
            opacity: 0.9,
            y: 1400,
        }, {
            opacity: 1,
            y: -1000,
        },
            0.2
        )
        // REMOVED PROFILE PICTURE & HAT ANIMATIONS
        .staggerFrom(
            ".wish-hbd span",
            0.7, {
            opacity: 0,
            y: -50,
            // scale: 0.3,
            rotation: 150,
            skewX: "30deg",
            ease: Elastic.easeOut.config(1, 0.5),
        },
            0.1
        )
        .staggerFromTo(
            ".wish-hbd span",
            0.7, {
            scale: 1.4,
            rotationY: 150,
        }, {
            scale: 1,
            rotationY: 0,
            color: "#ff69b4",
            ease: Expo.easeOut,
        },
            0.1,
            "party"
        )
        .from(
            ".wish h5",
            0.5, {
            opacity: 0,
            y: 10,
            skewX: "-15deg",
        },
            "party"
        )
        .staggerTo(
            ".eight svg",
            2.5, {
            visibility: "visible",
            opacity: 0,
            scale: 2, // Grow a bit, not explosion
            rotation: 720, // Spin
            y: -100, // Float up slightly
            repeat: -1, // Infinite loop
            repeatDelay: 0.5,
            ease: Power1.easeOut
        },
            0.3
        )
        .to(".six", 0.5, {
            opacity: 0,
            y: 30,
            zIndex: "-1",
        });

    // GIFT BOX INTERACTION
    // Note: The original timeline ends by showing ".nine". We need to modify this or hijack it.
    // Let's modify the timeline to hide ".nine" initially and show the gift box instead.

    // Clear the ".nine" animation from above and replace:
    tl.to(".nine", 0.1, { visibility: "visible", opacity: 0 }); // Ensure nine is there but unseen

    tl.to("#gift-box-container", 0.5, {
        visibility: "visible",
        opacity: 1
    }, "+=1");

    const giftBox = document.getElementById("gift-box-container");
    const finalMessage = document.querySelector(".nine");

    const hbdCenter = document.querySelector(".hbd-center");
    const cornerMsg = document.getElementById("cornerMsg");

    giftBox.addEventListener("click", () => {
        // Explode Confetti!
        burstConfetti();
        // Keep exploding for a while
        const burstInterval = setInterval(burstConfetti, 400); // More frequent bursts

        gsap.to(giftBox, 0.5, {
            scale: 1.5,
            opacity: 0,
            onComplete: () => {
                giftBox.style.display = "none";

                // Ensure parent container (.nine) is visible!
                gsap.to(".nine", 0.1, {
                    visibility: "visible",
                    opacity: 1
                });

                // 1. Reveal Center HBD Immediately
                gsap.to(hbdCenter, 1, {
                    visibility: "visible",
                    opacity: 1,
                    scale: 1,
                    ease: Back.easeOut.config(1.7)
                });

                // 2. Stop confetti after 10 seconds
                setTimeout(() => {
                    clearInterval(burstInterval);
                }, 10000);

                // 3. Reveal Corner Notification after 10 seconds
                setTimeout(() => {
                    gsap.to(cornerMsg, 1, {
                        visibility: "visible",
                        opacity: 1,
                        y: 0,
                        ease: Power2.easeOut
                    });
                }, 10000);
            }
        });
    });

    // Restart Animation on click
    // Restart Animation on click
    const replyBtn = document.getElementById("replay");
    replyBtn.addEventListener("click", () => {
        tl.restart();
        // Reset gift box
        giftBox.style.display = "block";
        gsap.set(giftBox, { opacity: 1, visibility: "visible", scale: 1 });
        // Hide new elements
        gsap.set(hbdCenter, { opacity: 0, visibility: "hidden", scale: 0.5 });
        gsap.set(cornerMsg, { opacity: 0, visibility: "hidden", y: 20 });

        // Reset Chat
        document.getElementById("typingInput").innerText = "";
        const dynamicMsg = document.querySelector(".message.outgoing.dynamic");
        if (dynamicMsg) dynamicMsg.remove();
    });

    // Send Button Logic (Inside Scope)
    const sendBtn = document.getElementById("sendBtn");
    // Remove old listeners to prevent duplicates on restart if any (though const prevents re-declaring in scoped run, better safe)
    const newSendBtn = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);

    newSendBtn.addEventListener("click", () => {
        const inputField = document.getElementById("typingInput");
        const msgText = inputField.innerText; // Use innerText for div
        if (!msgText) return; // Empty

        // Create Bubble
        const chatBody = document.getElementById("chatBody");
        const bubble = document.createElement("div");
        bubble.classList.add("message", "outgoing", "dynamic");
        bubble.innerText = msgText;
        chatBody.appendChild(bubble);

        // Clear input
        inputField.innerText = "";

        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;

        // Resume Main Timeline
        // We can fade out the chatbox if we want, or just continue
        tl.play();
    });
}


// Helper for Typewriter effect in INPUT
function typeWriterInput(element, text, speed, callback) {
    let i = 0;
    element.innerText = ""; // Clear
    function type() {
        if (i < text.length) {
            element.innerText += text.charAt(i); // Append text
            i++;
            // element.scrollLeft = element.scrollWidth; // REMOVE SCROLLING to allow wrap
            setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    type();
}

// Confetti Burst Effect
function burstConfetti() {
    // Clone existing confetti or create new simple squares/circles/SVGs
    // For simplicity, let's target the existing .eight svg elements and animate them wildly?
    // OR create new temporary elements. Creating new is better for "Explosion".

    const colors = ["#ff6aa3", "#a2d2ff", "#ffef78", "#c8b6ff"];
    const container = document.body; // or specific container

    for (let i = 0; i < 30; i++) {
        const conf = document.createElement("div");
        conf.classList.add("temp-confetti");
        conf.style.position = "absolute";
        conf.style.left = "50%";
        conf.style.top = "50%";
        conf.style.width = "10px";
        conf.style.height = "10px";
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.borderRadius = "50%";
        conf.style.zIndex = "9999";
        container.appendChild(conf);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 300;

        gsap.to(conf, 1 + Math.random(), {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            scale: 0.5,
            ease: Power1.easeOut,
            onComplete: () => {
                conf.remove();
            }
        });
    }
}



// Background Slideshow Logic
const images = [
    "img/1.jpg",
    "img/2.jpg",
    "img/3.jpg",
    "img/4.jpg",
    "img/5.jpg",
    "img/6.jpg"
]; // Add more if you have them
const container = document.getElementById('background-slideshow');

function spawnBackgroundImage() {
    if (!container) return;

    const img = document.createElement('img');
    img.src = images[Math.floor(Math.random() * images.length)];
    img.classList.add('bg-photo');

    // Random styling
    const size = Math.floor(Math.random() * 200) + 200; // 200px to 400px
    const left = Math.floor(Math.random() * 80); // 0% to 80% (keep partly on screen)
    const top = Math.floor(Math.random() * 80);
    const rotation = Math.floor(Math.random() * 360);

    // Organic blob shapes using 8 border-radius values
    const r1 = Math.floor(Math.random() * 40) + 30; // 30-70%
    const r2 = 100 - r1;
    const r3 = Math.floor(Math.random() * 40) + 30;
    const r4 = 100 - r3;
    const r5 = Math.floor(Math.random() * 40) + 30;
    const r6 = 100 - r5;
    const r7 = Math.floor(Math.random() * 40) + 30;
    const r8 = 100 - r7;

    img.style.width = `${size}px`;
    img.style.height = `${size}px`; // Keep square aspect ratio for shape, object-fit handles content
    img.style.left = `${left}vw`;
    img.style.top = `${top}vh`;
    img.style.transform = `rotate(${rotation}deg)`;
    img.style.borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${r7}% ${r8}%`;

    container.appendChild(img);

    // Fade in
    setTimeout(() => {
        img.style.opacity = 0.15; // Low opacity so text is readable
    }, 100);

    // Remove after some time to keep DOM clean
    setTimeout(() => {
        img.style.opacity = 0;
        setTimeout(() => {
            img.remove();
        }, 2000);
    }, 8000); // Life span 8s
}

// Spawn a new image every 1.5 seconds
setInterval(spawnBackgroundImage, 1500);

// Initial spawn
spawnBackgroundImage();
spawnBackgroundImage();
