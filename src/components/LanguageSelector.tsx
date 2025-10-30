import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';

type Props = { theme?: 'light' | 'dark' };

export default function LanguageSelector({ theme = 'light' }: Props) {
	const { language, setLanguage, t } = useLanguage();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const btnRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				ref.current && !ref.current.contains(target) &&
				!(menuRef.current && menuRef.current.contains(target))
			) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, []);

	useEffect(() => {
		if (!open || !btnRef.current) return;
		const rect = btnRef.current.getBoundingClientRect();
		const width = 240; // dropdown width estimate
		const padding = 8;
		const left = Math.min(Math.max(padding, rect.left), window.innerWidth - width - padding);
		const top = rect.bottom + 8;
		setMenuPos({ top, left });
	}, [open]);

	return (
		<div ref={ref} className="relative select-none">
			<button
        ref={btnRef}
				onClick={() => setOpen((v) => !v)}
				className={`flex items-center gap-1 text-sm tracking-wider ${theme === 'dark' ? 'text-gray-800' : 'text-white'}`}
				aria-haspopup="listbox"
				aria-expanded={open}
			>
				<span className="font-semibold">{language === 'en' ? t('EN') : t('ES')}</span>
				<span className="inline-block align-middle">▼</span>
			</button>
			{open && menuPos && createPortal(
				<div ref={menuRef} className="fixed w-60 bg-white rounded-xl shadow-lg p-2 z-[10000]" style={{ top: menuPos.top, left: menuPos.left }}>
					<ul className="max-h-60 overflow-auto" role="listbox">
						<li>
							<button
								onMouseDown={(e) => { e.stopPropagation(); setLanguage('es'); setOpen(false); }}
								className={`flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 ${language==='es' ? 'bg-gray-100' : ''}`}
								role="option"
								aria-selected={language==='es'}
							>
								<span>{t('Spanish')}</span>
							</button>
						</li>
						<li>
							<button
								onMouseDown={(e) => { e.stopPropagation(); setLanguage('en'); setOpen(false); }}
								className={`flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 ${language==='en' ? 'bg-gray-100' : ''}`}
								role="option"
								aria-selected={language==='en'}
							>
								<span>{t('English')}</span>
							</button>
						</li>
					</ul>
				</div>, document.body)
			}
		</div>
	);
}
