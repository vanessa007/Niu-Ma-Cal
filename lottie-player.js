// A minimal version of Lottie player
const setupLottie = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
    document.head.appendChild(script);
};

export { setupLottie }; 