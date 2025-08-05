import React, { useState } from 'react'

// ページ定義
type Page = 'intro' | 'game' | 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5'

// 導入ページコンポーネント
const IntroPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景のグリッド効果 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        animation: 'gridMove 20s linear infinite'
      }} />
      
      {/* メインタイトル */}
      <div style={{
        textAlign: 'center',
        zIndex: 10,
        marginBottom: '60px'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: '100',
          margin: '0 0 20px 0',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: 'linear-gradient(45deg, #00f5ff, #ff006e, #8338ec)',
          backgroundSize: '200% 200%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradientShift 3s ease-in-out infinite'
        }}>
          SENSOR
        </h1>
        <h2 style={{
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          fontWeight: '300',
          margin: '0 0 10px 0',
          letterSpacing: '0.15em',
          color: '#ffffff',
          opacity: 0.9
        }}>
          MYSTERY
        </h2>
        <div style={{
          width: '150px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)',
          margin: '20px auto',
          animation: 'pulseGlow 2s ease-in-out infinite'
        }} />
      </div>
      
      {/* サブタイトル */}
      <div style={{
        textAlign: 'center',
        marginBottom: '80px',
        opacity: 0.8
      }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          fontWeight: '300',
          margin: '0',
          letterSpacing: '0.1em',
          lineHeight: 1.6
        }}>
          スマホセンサーを駆使した<br />
          革新的謎解きゲーム
        </p>
      </div>
      
      {/* スタートボタン */}
      <button
        onClick={onStart}
        style={{
          background: 'transparent',
          border: '2px solid #00f5ff',
          color: '#00f5ff',
          fontSize: 'clamp(1rem, 3vw, 1.2rem)',
          fontWeight: '300',
          fontFamily: 'inherit',
          padding: '15px 40px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#00f5ff'
          e.currentTarget.style.color = '#000000'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 245, 255, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#00f5ff'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.background = '#00f5ff'
          e.currentTarget.style.color = '#000000'
        }}
      >
        START MISSION
      </button>
      
      {/* 装飾的な要素 */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '100px',
        height: '100px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transform: 'rotate(45deg)',
        animation: 'floatRotate 6s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        width: '60px',
        height: '60px',
        border: '1px solid rgba(0, 245, 255, 0.3)',
        borderRadius: '50%',
        animation: 'floatPulse 4s ease-in-out infinite'
      }} />
      
      {/* 下部の説明 */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        fontSize: '0.8rem',
        opacity: 0.6,
        letterSpacing: '0.1em'
      }}>
        <p style={{ margin: '0' }}>
          加速度センサー | ジャイロスコープ | タッチ検出
        </p>
      </div>
    </div>
  )
}

// ゲームページコンポーネント（ステージ選択）
const GamePage = ({ onStageSelect }: { onStageSelect: (stage: Page) => void }) => {
  const stages = [
    { id: 'stage1' as Page, name: 'MOTION', desc: '動作センサー', color: '#00f5ff' },
    { id: 'stage2' as Page, name: 'GRAVITY', desc: '重力センサー', color: '#ff006e' },
    { id: 'stage3' as Page, name: 'ROTATE', desc: '回転センサー', color: '#8338ec' },
    { id: 'stage4' as Page, name: 'TOUCH', desc: 'タッチセンサー', color: '#ffbe0b' },
    { id: 'stage5' as Page, name: 'FUSION', desc: '複合センサー', color: '#fb5607' }
  ]

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
        fontWeight: '100',
        textAlign: 'center',
        margin: '20px 0 40px 0',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }}>
        STAGE SELECT
      </h1>
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%'
      }}>
        {stages.map((stage, index) => (
          <button
            key={stage.id}
            onClick={() => onStageSelect(stage.id)}
            style={{
              background: 'transparent',
              border: `2px solid ${stage.color}`,
              color: stage.color,
              padding: '20px',
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              fontFamily: 'inherit',
              fontWeight: '300',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = stage.color
              e.currentTarget.style.color = '#000000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = stage.color
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.2em', fontWeight: '400' }}>{stage.name}</div>
                <div style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '5px' }}>{stage.desc}</div>
              </div>
              <div style={{ fontSize: '1.5em' }}>{'>'}</div>
            </div>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onStageSelect('intro')}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'rgba(255,255,255,0.7)',
          padding: '10px 20px',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          cursor: 'pointer',
          margin: '20px auto 0',
          letterSpacing: '0.1em'
        }}
      >
        ← BACK TO INTRO
      </button>
    </div>
  )
}

// ステージコンポーネント（テンプレート）
const StagePage = ({ 
  stageNumber, 
  stageName, 
  onBack 
}: { 
  stageNumber: number
  stageName: string
  onBack: () => void 
}) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.7)',
            padding: '8px 15px',
            fontSize: '0.8rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            letterSpacing: '0.1em'
          }}
        >
          ← BACK
        </button>
        
        <h1 style={{
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
          fontWeight: '100',
          margin: '0',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          STAGE {stageNumber}: {stageName}
        </h1>
        
        <div style={{ width: '60px' }} /> {/* スペーサー */}
      </div>
      
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '300' }}>
            {stageName} ステージ
          </h2>
          <p style={{ margin: '0', opacity: 0.7, fontSize: '1rem' }}>
            ここにステージコンテンツが表示されます
          </p>
        </div>
      </div>
    </div>
  )
}

// メインAppコンポーネント
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('intro')

  const handlePageChange = (page: Page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'intro':
        return <IntroPage onStart={() => handlePageChange('game')} />
      case 'game':
        return <GamePage onStageSelect={handlePageChange} />
      case 'stage1':
        return <StagePage stageNumber={1} stageName="MOTION" onBack={() => handlePageChange('game')} />
      case 'stage2':
        return <StagePage stageNumber={2} stageName="GRAVITY" onBack={() => handlePageChange('game')} />
      case 'stage3':
        return <StagePage stageNumber={3} stageName="ROTATE" onBack={() => handlePageChange('game')} />
      case 'stage4':
        return <StagePage stageNumber={4} stageName="TOUCH" onBack={() => handlePageChange('game')} />
      case 'stage5':
        return <StagePage stageNumber={5} stageName="FUSION" onBack={() => handlePageChange('game')} />
      default:
        return <IntroPage onStart={() => handlePageChange('game')} />
    }
  }

  return renderPage()
}