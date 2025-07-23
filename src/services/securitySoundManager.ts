// Sound effects for security alerts
export class SecuritySoundManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()

  constructor() {
    // Initialize audio context on user interaction
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new AudioContext()
    } catch (error) {
      console.warn('Audio context not supported:', error)
    }
  }

  // Generate alert sounds programmatically
  private generateAlertSound(frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const channelData = buffer.getChannelData(0)

    for (let i = 0; i < channelData.length; i++) {
      const t = i / sampleRate
      let value = 0

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t)
          break
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
          break
        case 'triangle':
          value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
          break
      }

      // Apply envelope (fade in/out)
      const envelope = Math.min(t * 10, 1, (duration - t) * 10)
      channelData[i] = value * envelope * 0.1 // Keep volume low
    }

    return buffer
  }

  // Initialize sound library
  initializeSounds() {
    if (!this.audioContext) return

    // Critical alert - high frequency, sharp sound
    const criticalSound = this.generateAlertSound(800, 0.3, 'square')
    if (criticalSound) this.sounds.set('critical', criticalSound)

    // High alert - medium frequency, urgent sound
    const highSound = this.generateAlertSound(600, 0.4, 'sine')
    if (highSound) this.sounds.set('high', highSound)

    // Medium alert - lower frequency, softer sound
    const mediumSound = this.generateAlertSound(400, 0.3, 'triangle')
    if (mediumSound) this.sounds.set('medium', mediumSound)

    // Low alert - subtle notification
    const lowSound = this.generateAlertSound(300, 0.2, 'sine')
    if (lowSound) this.sounds.set('low', lowSound)

    // Success sound - pleasant confirmation
    const successSound = this.generateAlertSound(523, 0.3, 'sine') // C note
    if (successSound) this.sounds.set('success', successSound)

    console.log('🔊 Security sound effects initialized')
  }

  // Play alert sound based on severity
  playAlert(severity: 'low' | 'medium' | 'high' | 'critical' | 'success') {
    if (!this.audioContext || !this.sounds.has(severity)) return

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = this.sounds.get(severity)!
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      // Adjust volume based on severity
      const volumes = {
        low: 0.1,
        medium: 0.15,
        high: 0.2,
        critical: 0.25,
        success: 0.12
      }
      gainNode.gain.value = volumes[severity]
      
      source.start()
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }

  // Play simulation start sound sequence
  playSimulationStart() {
    this.playAlert('high')
    setTimeout(() => this.playAlert('medium'), 200)
  }

  // Play simulation stop sound
  playSimulationStop() {
    this.playAlert('success')
  }

  // Play threat detected sequence
  playThreatDetected(severity: 'low' | 'medium' | 'high' | 'critical') {
    this.playAlert(severity)
    
    // For critical threats, play a sequence
    if (severity === 'critical') {
      setTimeout(() => this.playAlert('high'), 400)
      setTimeout(() => this.playAlert('critical'), 800)
    }
  }
}

export const soundManager = new SecuritySoundManager()
