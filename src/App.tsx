import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

// TrainStageコンポーネント
const TrainStage = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const frameRef = useRef<number>()
  
  const railsRef = useRef<THREE.Group>()
  const buildingsRef = useRef<THREE.Group>()
  
  // インタラクション状態管理
  const [selectedDirection, setSelectedDirection] = useState<'left' | 'right' | null>(null)
  const [isCurving, setIsCurving] = useState(false)
  const [curvingStartTime, setCurvingStartTime] = useState(0)
  
  // アニメーション変数
  const trainSpeedRef = useRef(0.15)
  const totalRotationRef = useRef(0)
  const curveTargetRotationRef = useRef(0)
  const cameraLeanRef = useRef(0)
  const cameraShiftRef = useRef(0)
  const speedMultiplierRef = useRef(1)
  const trackCurveRef = useRef(0)
  
  // レール切り替え用の状態
  const [upcomingCurveDirection, setUpcomingCurveDirection] = useState<'left' | 'right' | null>(null)
  const curvePathRef = useRef<THREE.Vector3[]>([])
  const currentPathIndexRef = useRef(0)
  const [isOnCurve, setIsOnCurve] = useState(false)
  
  // レールを切り替える関数
  const switchRailToCurve = (direction: 'left' | 'right') => {
    const railSystem = railsRef.current?.children[0] as THREE.Group
    if (!railSystem?.userData?.sections) return
    
    const sections = railSystem.userData.sections
    
    // 前方のセクションを見つけてカーブレールに変更
    const cameraZ = cameraRef.current?.position.z || 0
    const targetZ = cameraZ - 30 // 前方30ユニット
    
    // 該当するセクションを探す
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (section.zPosition <= targetZ && section.zPosition > targetZ - 20) {
        // このセクションをカーブレールに変更
        railSystem.remove(section.group)
        
        // カーブレールを作成
        const curveSection = createCurveRailSection(section.zPosition, direction)
        curveSection.position.z = section.zPosition
        railSystem.add(curveSection)
        
        // セクション情報を更新
        sections[i] = {
          group: curveSection,
          type: direction + 'Curve',
          zPosition: section.zPosition
        }
        
        console.log(`Switched rail section at Z=${section.zPosition} to ${direction} curve`)
        break
      }
    }
  }
  
  // カーブパスを計算する関数
  const calculateCurvePath = (direction: 'left' | 'right', startPos: THREE.Vector3) => {
    const path = []
    const radius = 20
    const steps = 60
    const dirMultiplier = direction === 'left' ? -1 : 1
    
    for (let i = 0; i <= steps; i++) {
      const angle = (Math.PI / 2) * (i / steps)
      const x = startPos.x + dirMultiplier * radius * Math.sin(angle)
      const y = startPos.y
      const z = startPos.z - radius * (1 - Math.cos(angle))
      
      path.push(new THREE.Vector3(x, y, z))
    }
    
    return path
  }
  
  // 選択処理：1秒後にレール切り替え開始
  const handleDirectionSelect = (direction: 'left' | 'right') => {
    if (isCurving || upcomingCurveDirection) return // カーブ中または予約済みは選択不可
    
    console.log('Direction selected:', direction)
    setSelectedDirection(direction)
    setUpcomingCurveDirection(direction)
    
    setTimeout(() => {
      console.log('Switching rail to curve and starting animation')
      
      // レールを切り替え
      switchRailToCurve(direction)
      
      // カーブパスを計算
      const currentPos = cameraRef.current?.position || new THREE.Vector3(0, 1, 0)
      const curvePath = calculateCurvePath(direction, currentPos)
      curvePathRef.current = curvePath
      currentPathIndexRef.current = 0
      
      // カーブアニメーション開始
      setIsCurving(true)
      setIsOnCurve(true)
      setCurvingStartTime(Date.now())
      setSelectedDirection(null)
      setUpcomingCurveDirection(null)
      
    }, 1000) // 1秒後
  }
  
  useEffect(() => {
    if (!mountRef.current) return

    // シーンの設定
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000) // 背景は黒
    sceneRef.current = scene

    // カメラの設定（縦向きに最適化）
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 1, 0)
    camera.lookAt(0, 1, -10)
    cameraRef.current = camera

    // レンダラーの設定
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1) // 背景色を黒に設定
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // 線路の作成
    const railsGroup = new THREE.Group()
    railsRef.current = railsGroup
    scene.add(railsGroup)

    // レールセクションの種類
    type RailType = 'straight' | 'leftCurve' | 'rightCurve'
    
    // レール用マテリアル
    const railMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      wireframe: true,
      wireframeLinewidth: 2
    })
    
    const sleeperMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xcccccc,
      wireframe: true,
      wireframeLinewidth: 1
    })
    
    // 直線レールセクションを作成
    const createStraightRailSection = (startZ: number, length: number = 10) => {
      const sectionGroup = new THREE.Group()
      
      for (let i = 0; i < length; i++) {
        const z = startZ - i * 1.5
        
        // 左レール
        const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 1.2), railMaterial)
        leftRail.position.set(-1, 0.05, z)
        sectionGroup.add(leftRail)
        
        // 右レール
        const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 1.2), railMaterial)
        rightRail.position.set(1, 0.05, z)
        sectionGroup.add(rightRail)
        
        // 枕木
        if (i % 2 === 0) {
          const sleeper = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 0.3), sleeperMaterial)
          sleeper.position.set(0, 0, z)
          sectionGroup.add(sleeper)
        }
      }
      
      sectionGroup.userData = { type: 'straight', length }
      return sectionGroup
    }
    
    // カーブレールセクションを作成
    const createCurveRailSection = (startZ: number, direction: 'left' | 'right', radius: number = 20) => {
      const sectionGroup = new THREE.Group()
      const curveLength = 30 // カーブの長さ
      const angleStep = (Math.PI / 2) / curveLength // 90度を分割
      
      for (let i = 0; i < curveLength; i++) {
        const angle = angleStep * i
        const dirMultiplier = direction === 'left' ? -1 : 1
        
        // カーブの中心点からの位置計算
        const centerX = dirMultiplier * radius
        const x = centerX - dirMultiplier * radius * Math.cos(angle)
        const z = startZ - radius * Math.sin(angle)
        
        // レールの角度
        const railAngle = dirMultiplier * angle
        
        // 左レール（内側レール）
        const leftRailRadius = radius - 1
        const leftRailX = centerX - dirMultiplier * leftRailRadius * Math.cos(angle)
        const leftRailZ = startZ - leftRailRadius * Math.sin(angle)
        const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 1.2), railMaterial)
        leftRail.position.set(leftRailX, 0.05, leftRailZ)
        leftRail.rotation.y = railAngle
        sectionGroup.add(leftRail)
        
        // 右レール（外側レール）
        const rightRailRadius = radius + 1
        const rightRailX = centerX - dirMultiplier * rightRailRadius * Math.cos(angle)
        const rightRailZ = startZ - rightRailRadius * Math.sin(angle)
        const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 1.2), railMaterial)
        rightRail.position.set(rightRailX, 0.05, rightRailZ)
        rightRail.rotation.y = railAngle
        sectionGroup.add(rightRail)
        
        // 枕木
        if (i % 2 === 0) {
          const sleeper = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 0.3), sleeperMaterial)
          sleeper.position.set(x, 0, z)
          sleeper.rotation.y = railAngle
          sectionGroup.add(sleeper)
        }
      }
      
      sectionGroup.userData = { type: direction + 'Curve', radius, angleStep, curveLength }
      return sectionGroup
    }
    
    // レールシステム全体を作成
    const createRailSystem = () => {
      const railSystemGroup = new THREE.Group()
      
      // 初期は全て直線レール
      const sections = []
      
      // 手前側の直線レール（常に表示）
      for (let i = 0; i < 5; i++) {
        const section = createStraightRailSection(i * -15, 10)
        section.position.z = i * -15
        railSystemGroup.add(section)
        sections.push({ group: section, type: 'straight', zPosition: i * -15 })
      }
      
      // 遠くの予備セクション
      for (let i = 5; i < 20; i++) {
        const section = createStraightRailSection(i * -15, 10)
        section.position.z = i * -15
        railSystemGroup.add(section)
        sections.push({ group: section, type: 'straight', zPosition: i * -15 })
      }
      
      railSystemGroup.userData = { sections }
      return railSystemGroup
    }

    const railSystem = createRailSystem()
    railsGroup.add(railSystem)

    // 建物の作成
    const buildingsGroup = new THREE.Group()
    buildingsRef.current = buildingsGroup
    scene.add(buildingsGroup)

    // 建物を作成する関数
    const createBuilding = (x: number, z: number, width: number, height: number, depth: number) => {
      // ワイヤーフレームボックスジオメトリ
      const geometry = new THREE.BoxGeometry(width, height, depth)
      const edges = new THREE.EdgesGeometry(geometry)
      const material = new THREE.LineBasicMaterial({ 
        color: 0xffffff, // 白色
        linewidth: 1
      })
      const building = new THREE.LineSegments(edges, material)
      building.position.set(x, height / 2, z)
      return building
    }

    // 建物を配置 - ループしないよう大量に生成
    for (let i = 0; i < 300; i++) { // 建物を大幅に増加
      const z = -i * 6 - 10
      
      // 左側の建物群
      const leftHeight = Math.random() * 12 + 4
      const leftWidth = Math.random() * 4 + 2
      const leftDepth = Math.random() * 3 + 3
      const leftBuilding = createBuilding(-10 - Math.random() * 5, z, leftWidth, leftHeight, leftDepth)
      buildingsGroup.add(leftBuilding)
      
      // 右側の建物群
      const rightHeight = Math.random() * 15 + 5
      const rightWidth = Math.random() * 5 + 2
      const rightDepth = Math.random() * 4 + 3
      const rightBuilding = createBuilding(10 + Math.random() * 5, z, rightWidth, rightHeight, rightDepth)
      buildingsGroup.add(rightBuilding)
      
      // より多くの後方建物
      if (Math.random() > 0.5) {
        const backHeight = Math.random() * 8 + 3
        const backWidth = Math.random() * 6 + 3
        const backDepth = Math.random() * 5 + 4
        const backX = (Math.random() - 0.5) * 30
        const backZ = z - (Math.random() * 15 + 8)
        const backBuilding = createBuilding(backX, backZ, backWidth, backHeight, backDepth)
        buildingsGroup.add(backBuilding)
      }
      
      // 時々、中距離の建物も追加
      if (Math.random() > 0.6) {
        const midHeight = Math.random() * 10 + 2
        const midWidth = Math.random() * 3 + 2
        const midDepth = Math.random() * 3 + 2
        const midX = (Math.random() - 0.5) * 8 + (Math.random() > 0.5 ? -6 : 6)
        const midBuilding = createBuilding(midX, z - 3, midWidth, midHeight, midDepth)
        buildingsGroup.add(midBuilding)
      }
    }



    // アニメーションループ（新設計）
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const currentTime = Date.now()
      const time = currentTime * 0.001
      
      // カーブ中の処理
      if (isCurving && isOnCurve) {
        const elapsed = (currentTime - curvingStartTime) / 1000
        const curveDuration = 4 // 4秒でカーブ完了
        
        if (elapsed < curveDuration && curvePathRef.current.length > 0) {
          // カーブパスに沿ってカメラを移動
          const pathProgress = elapsed / curveDuration
          const pathIndex = Math.floor(pathProgress * (curvePathRef.current.length - 1))
          
          if (pathIndex < curvePathRef.current.length && cameraRef.current) {
            const targetPos = curvePathRef.current[pathIndex]
            
            // カメラ位置を補間
            cameraRef.current.position.lerp(targetPos, 0.1)
            
            // カメラの方向を次のポイントに向ける
            if (pathIndex + 5 < curvePathRef.current.length) {
              const lookAtPos = curvePathRef.current[pathIndex + 5]
              cameraRef.current.lookAt(lookAtPos)
            }
            
            // カーブ中のカメラ傾き演出
            const curveIntensity = Math.sin(pathProgress * Math.PI) * 0.3
            const direction = selectedDirection || upcomingCurveDirection || 'left'
            cameraRef.current.rotation.z = direction === 'left' ? -curveIntensity : curveIntensity
          }
          
          currentPathIndexRef.current = pathIndex
        } else {
          // カーブ完了
          setIsCurving(false)
          setIsOnCurve(false)
          curvePathRef.current = []
          currentPathIndexRef.current = 0
          
          // カメラを通常状態に戻す
          if (cameraRef.current) {
            cameraRef.current.rotation.z = 0
            cameraRef.current.lookAt(0, 1, -10)
          }
        }
      }
      
      // 通常の前進移動（カーブ中でない場合）
      if (!isOnCurve) {
        // 線路と建物を手前に移動
        if (railsRef.current) {
          railsRef.current.position.z += trainSpeedRef.current
        }
        
        if (buildingsRef.current) {
          buildingsRef.current.position.z += trainSpeedRef.current
        }
      }
      
      // カメラの基本振動（電車の揺れ）
      if (cameraRef.current && !isOnCurve) {
        const baseShakeY = Math.sin(time * 5) * 0.03 + Math.sin(time * 12) * 0.01
        const baseShakeX = Math.sin(time * 3) * 0.015 + Math.sin(time * 8) * 0.005
        
        cameraRef.current.position.y = 1 + baseShakeY
        cameraRef.current.position.x = baseShakeX
      }
      
      renderer.render(scene, camera)
    }

    animate()

    // リサイズハンドラー
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }
    
    window.addEventListener('resize', handleResize)

    // クリーンアップ
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])
  
  return (
    <div 
      style={{
        width: '100vw', 
        height: '100vh',
        overflow: 'hidden',
        background: '#000000',
        position: 'relative'
      }}
    >
      {/* Three.jsキャンバス */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
      
      {/* インタラクション用の透明レイヤー */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          zIndex: 10
        }}
      >
        {/* 左半分 - 左に曲がる */}
        <div
          style={{
            width: '50%',
            height: '100%',
            background: (selectedDirection === 'left' || upcomingCurveDirection === 'left') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: (selectedDirection === 'left' || upcomingCurveDirection === 'left') ? '2px solid white' : 'none'
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Left click!')
            handleDirectionSelect('left')
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Left touch!')
            handleDirectionSelect('left')
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Left mouse down!')
            handleDirectionSelect('left')
          }}
        >
          {(selectedDirection === 'left' || upcomingCurveDirection === 'left') && (
            <div style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              ← 左に曲がります
            </div>
          )}
        </div>
        
        {/* 右半分 - 右に曲がる */}
        <div
          style={{
            width: '50%',
            height: '100%',
            background: (selectedDirection === 'right' || upcomingCurveDirection === 'right') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: (selectedDirection === 'right' || upcomingCurveDirection === 'right') ? '2px solid white' : 'none'
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Right click!')
            handleDirectionSelect('right')
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Right touch!')
            handleDirectionSelect('right')
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Right mouse down!')
            handleDirectionSelect('right')
          }}
        >
          {(selectedDirection === 'right' || upcomingCurveDirection === 'right') && (
            <div style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              右に曲がります →
            </div>
          )}
        </div>
      </div>
      
      {/* カーブ中の迫力ある表示 */}
      {isCurving && (
        <>
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffff00',
            fontSize: '32px',
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            zIndex: 20,
            animation: 'pulse 0.5s infinite alternate'
          }}>
            🚂💨 急カーブ！！
      </div>
          
          {/* カーブ方向インジケータ */}
    <div style={{
            position: 'absolute',
            top: '50%',
            left: (selectedDirection || upcomingCurveDirection) === 'right' ? '80%' : '20%',
            transform: 'translate(-50%, -50%)',
            color: '#ff4444',
            fontSize: '48px',
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            zIndex: 20,
            animation: 'bounce 0.3s infinite'
          }}>
            {(selectedDirection || upcomingCurveDirection) === 'right' ? '→→→' : '←←←'}
          </div>
          
          {/* スピード感演出 */}
          <div style={{
            position: 'absolute',
            bottom: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#00ff00',
                fontSize: '24px',
                fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            zIndex: 20
          }}>
            ⚡ スピードアップ！
          </div>
        </>
      )}
      
      {/* 操作説明とデバッグ情報 */}
      {!selectedDirection && !isCurving && !upcomingCurveDirection && (
        <>
          <div style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '18px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            zIndex: 20,
            background: 'rgba(0,0,0,0.5)',
            padding: '10px',
            borderRadius: '10px'
          }}>
            📱 画面の左右をタップして方向を選択
          </div>
          
          {/* 左右の境界線表示 */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            width: '2px',
            height: '100%',
            background: 'rgba(255,255,255,0.3)',
            zIndex: 5
          }} />
          
          {/* 左側の表示 */}
                <div style={{
            position: 'absolute',
            top: '20%',
            left: '25%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            zIndex: 15,
            opacity: 0.7
          }}>
            ← 左
                </div>
          
          {/* 右側の表示 */}
                <div style={{
            position: 'absolute',
            top: '20%',
            left: '75%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            zIndex: 15,
            opacity: 0.7
          }}>
            右 →
                </div>
        </>
      )}
    </div>
  )
}

// メインAppコンポーネント
export default function App() {
  return <TrainStage />
}
