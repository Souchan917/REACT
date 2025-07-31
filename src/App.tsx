import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// カラーパレット
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']

// カウンターコンポーネント
const Counter = ({ title, color }: { title: string; color: string }) => {
  const [count, setCount] = useState(0)
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: color,
        padding: '20px',
        borderRadius: '15px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        color: 'white',
        fontWeight: 'bold'
      }}
      onClick={() => setCount(count + 1)}
    >
      <h3 style={{ margin: 0, fontSize: '18px' }}>{title}</h3>
      <motion.div
        key={count}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{ fontSize: '24px', marginTop: '10px' }}
      >
        {count}
      </motion.div>
    </motion.div>
  )
}

// ボールアニメーションコンポーネント
const BouncingBall = () => {
  return (
    <motion.div
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        margin: '20px auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }}
      animate={{
        y: [0, -40, 0],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// テキストアニメーションコンポーネント
const AnimatedText = () => {
  const text = "React は動いています！"
  
  return (
    <div style={{ textAlign: 'center', margin: '30px 0' }}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 2
          }}
          style={{
            display: 'inline-block',
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors[index % colors.length],
            margin: '0 2px'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  )
}

// カードコンポーネント
const FeatureCard = ({ title, description, icon, color }: {
  title: string;
  description: string;
  icon: string;
  color: string;
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  
  return (
    <motion.div
      style={{
        perspective: '1000px',
        width: '250px',
        height: '150px',
        margin: '10px',
        cursor: 'pointer'
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative'
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* フロント面 */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: color,
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontSize: '30px', marginBottom: '10px' }}>{icon}</div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>{title}</h3>
        </div>
        
        {/* バック面 */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: '#2C3E50',
            borderRadius: '15px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: '20px',
            transform: 'rotateY(180deg)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <p style={{ margin: 0, textAlign: 'center', fontSize: '14px' }}>
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// リアルタイム時計
const Clock = () => {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        margin: '20px auto',
        maxWidth: '300px'
      }}
    >
      <h3 style={{ margin: '0 0 10px 0' }}>リアルタイム時計</h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {time.toLocaleTimeString('ja-JP')}
      </div>
      <div style={{ fontSize: '16px', marginTop: '5px' }}>
        {time.toLocaleDateString('ja-JP')}
      </div>
    </motion.div>
  )
}

export default function App() {
  const [showDemo, setShowDemo] = useState(false)
  
  const features = [
    {
      title: "useState",
      description: "コンポーネントの状態を管理します。クリックでカウンターが増加します。",
      icon: "📊",
      color: "#FF6B6B"
    },
    {
      title: "useEffect",
      description: "副作用を処理します。時計は1秒ごとに自動更新されます。",
      icon: "⏰",
      color: "#4ECDC4"
    },
    {
      title: "Props",
      description: "コンポーネント間でデータを渡します。各カードは異なるpropsを受け取ります。",
      icon: "📦",
      color: "#45B7D1"
    },
    {
      title: "Animation",
      description: "Framer Motionでスムーズなアニメーションを実現します。",
      icon: "✨",
      color: "#96CEB4"
    }
  ]

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h1 style={{
            fontSize: '48px',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 20px 0'
          }}>
            React テストデモ
          </h1>
          <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
            Reactの様々な機能を視覚的にテストできます
          </p>
        </motion.header>

        {!showDemo ? (
          <motion.div
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.button
              onClick={() => setShowDemo(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                fontSize: '24px',
                fontWeight: 'bold',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}
            >
              🚀 React デモを開始
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* アニメーションテキスト */}
              <AnimatedText />
              
              {/* バウンシングボール */}
              <BouncingBall />
              
              {/* 時計 */}
              <Clock />
              
              {/* カウンターグリッド */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ margin: '40px 0' }}
              >
                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
                  インタラクティブカウンター
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  {colors.slice(0, 4).map((color, index) => (
                    <Counter
                      key={index}
                      title={`カウンター ${index + 1}`}
                      color={color}
                    />
                  ))}
                </div>
              </motion.section>
              
              {/* 機能説明カード */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ margin: '40px 0' }}
              >
                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
                  React機能の説明（カードをクリック）
                </h2>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '20px'
                }}>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <FeatureCard {...feature} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
              
              {/* リセットボタン */}
              <motion.div
                style={{ textAlign: 'center', marginTop: '40px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  onClick={() => setShowDemo(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: '#6C5CE7',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  🔄 リセット
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
