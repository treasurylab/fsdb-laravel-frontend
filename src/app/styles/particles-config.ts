var dotColors = ['#C72125', '#F1B417', '#0F8841'];
var lineColor = '#B4B4B8';

export const ParticlesConfig = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 1400,
      },
    },
    color: {
      value: dotColors,
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 1,
        color: lineColor,
      },
      polygon: {
        nb_sides: 6,
      },
    },
    opacity: {
      value: 1,
      random: true,
      anim: {
        enable: true,
        speed: 0.8,
        opacity_min: 0.5,
        sync: true,
      },
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        size_min: 1.5,
        sync: true,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: lineColor,
      opacity: 1,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: true,
      attract: {
        enable: true,
        rotateX: 2000,
        rotateY: 2000,
      },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'grab',
      },
      onclick: {
        enable: true,
        mode: 'repulse',
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 200,
        line_linked: {
          opacity: 3,
        },
      },
      repulse: {
        distance: 250,
        duration: 2,
      },
    },
  },
  retina_detect: true,
};
