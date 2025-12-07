import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from './stores/config-store'
import { CARD_SPACING } from '@/consts'
import MusicSVG from '@/svgs/music.svg'
import { HomeDraggableLayer } from './home-draggable-layer'
import PlaySVG from '@/svgs/play.svg'
import PauseSVG from '@/svgs/pause.svg'
import PrevSVG from '@/svgs/prev.svg'
import NextSVG from '@/svgs/next.svg'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function MusicCard() {
	const center = useCenterStore()
	const { cardStyles } = useConfigStore()
	const styles = cardStyles.musicCard
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard
	const calendarCardStyles = cardStyles.calendarCard

	const playlist = useMemo(
		() => [
			{ title: 'Let Her Go - Passenger', url: 'http://music.163.com/song/media/outer/url?id=2080057492.mp3' },
			{ title: '我记得 - 清晨大攀', url: 'http://music.163.com/song/media/outer/url?id=2131522830.mp3' },
			{ title: '海底 - 一支榴莲', url: 'http://music.163.com/song/media/outer/url?id=1430583016.mp3' }
		],
		[]
	)

	const [currentIndex, setCurrentIndex] = useState(0)
	const [playing, setPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + CARD_SPACING + hiCardStyles.width / 2 - styles.offset
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - clockCardStyles.offset + CARD_SPACING + calendarCardStyles.height + CARD_SPACING
	const playerWidth = styles.width + 80

	useEffect(() => {
		const el = audioRef.current
		if (!el) return
		el.src = playlist[currentIndex]?.url || ''
		if (playing) {
			void el.play().catch(() => {})
		} else {
			el.pause()
		}
	}, [currentIndex, playing, playlist])

	const handleTimeUpdate = () => {
		const el = audioRef.current
		if (!el) return
		const d = el.duration || 0
		const c = el.currentTime || 0
		setProgress(d > 0 ? Math.min(100, Math.max(0, (c / d) * 100)) : 0)
	}

	const handleEnded = () => {
		setCurrentIndex(i => (i + 1) % playlist.length)
		setPlaying(true)
	}

	const togglePlay = () => {
		setPlaying(p => !p)
	}

	const prev = () => {
		setCurrentIndex(i => (i - 1 + playlist.length) % playlist.length)
		setPlaying(true)
	}

	const next = () => {
		setCurrentIndex(i => (i + 1) % playlist.length)
		setPlaying(true)
	}

	return (
		<HomeDraggableLayer cardKey='musicCard' x={x} y={y} width={playerWidth} height={styles.height}>
			<Card order={styles.order} width={playerWidth} height={styles.height} x={x} y={y} className='flex items-center gap-3'>
				<MusicSVG className='h-8 w-8' />

				<div className='flex-1'>
					<div className='text-secondary text-sm'>{playlist[currentIndex]?.title || '音乐'}</div>
					<div className='mt-1 h-2 rounded-full bg-white/60'>
						<div className='bg-linear h-full rounded-full' style={{ width: `${progress}%` }} />
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<button onClick={prev} className='flex h-10 w-10 items-center justify-center rounded-full bg-white'>
						<PrevSVG />
					</button>
					<button onClick={togglePlay} className='flex h-10 w-10 items-center justify-center rounded-full bg-white'>
						{playing ? <PauseSVG /> : <PlaySVG />}
					</button>
					<button onClick={next} className='flex h-10 w-10 items-center justify-center rounded-full bg-white'>
						<NextSVG />
					</button>
				</div>

				<audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
			</Card>
		</HomeDraggableLayer>
	)
}
