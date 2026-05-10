import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase)

  CustomEase.create('cinema', 'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('premium', 'M0,0 C0.25,0.46 0.45,0.94 1,1')
  CustomEase.create('back-out', 'M0,0 C0.34,1.56 0.64,1 1,1')

  gsap.defaults({
    ease: 'premium',
    duration: 0.8,
  })

  ScrollTrigger.config({
    ignoreMobileResize: true,
  })
}

export { gsap, ScrollTrigger }
