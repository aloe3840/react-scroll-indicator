import { useEffect, useState } from 'react'
import './scroll-indicator.css'

export default function ScrollIndicator({url}){
  //useEffect를 쓰기 위해 서버주소, State 필요
  //fetch와 같이 오래 걸리는 작업을 할 때 => useEffect사용
  
  //응답 데이터를 받아서 저장할 State
  //상태 : 서버 데이터, 로딩체크, 에러메세지, 스크롤 위치
  let [data, setDate] = useState([])
  let [loading, setLoading] = useState(false)
  let [errMsg, setErrMsg] = useState("")
  let [scrollPercentage, setScrollPercentage] = useState(0)
  
  //사이드 기능 => useEffect
  //useEffect는 컴포넌트 생성시, 변경시, 해제시 코드 삽입
  
  //fetch (HTTP요청)은 화면에 영향이 가지않도록 async
  async function fetchData(url){
    try{
      //fetch요청을 하기 전에 로딩 상태로 만든다
      setLoading(true)  //로딩상태 ON
      let res = await fetch(url) 
      //처리가 완료될 때까지 await로 기다리게 함
      //응답으로 받은 문자열을 json으로 인식
      const res_json = await res.json()
      
      setDate(res_json.products)
      //데이터에 저장 했으니까 로딩상태 해제
      setLoading(false)
    }catch(e){
      //try코드를 실행하다가 에러 발생시 catch안으로 옴
      setErrMsg(e.message)
      console.log(e)
    }
  }
  
  useEffect(()=>{
    //처음에는 무조건 1번 실행 => 생성시:mount, 변경시:  해제시:unmount
    //fetch로 get요청해서 데이터를 받아서 data에 넣자
    fetchData(url)
    
  }, [url]) //이렇게 데이터를 넘겨주지 않으면 모든 코드에 대해서 실행함

   //스크롤 이벤트 처리
  useEffect(()=>{
    window.addEventListener('scroll', changeScrollEvent)
  }, [])

  function changeScrollEvent(){
    //스크롤의 위치를 감지 => 현재 스크롤 위치
    let scrolled = document.documentElement.scrollTop;
    //창이 작을 수도 있으니까 현재 열려있는 창의 스크롤 범위를
    //계산 => 전체 스크롤 가능한 범위
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    //(현재 / 전체) * 100 : 퍼센트
    setScrollPercentage((scrolled / height) * 100)
  }
  
  console.log(data)

  if(loading){  //로딩중이면 (loading === true)
    //컴포넌트도 함수기 때문에 return을 만나면 즉시 종료 (밑에 코드 실행 X)
    return(
        <div>데이터 로딩 중...</div>
      )
  }

  if(errMsg){  //에러메시지에 무언가 있으면
    return(
      <div>{errMsg}</div>
    )
  }
  
  return(
    <>
      <div className='top-nav'>
        <h1>Scroll Indicator</h1>
        {/* 스크롤 진행도 전체 범위 */}
        <div className='scroll-progress'>
          {/* 스크롤의 실제 위치를 퍼센트로 그려줄 박스 */}
          <div className='current-progress' style={{width: `${scrollPercentage}%`}}> 
          </div>
        </div>
      </div>

      {/* 스크롤용 데이터 */}
      <div className='data-list'>
        {
          //data가 비어있지 않고 데이터 길이가 0보다 클 때 실행
          data && data.length > 0 ? 
          //data를 map을 통해 p태그로 출력
          data.map((e, idx)=>{   //e역할 => data[0], data[1] ...
            return(
              <p key={idx}>{e.title}</p>
            )
          }) :
          null
        }
      </div>
    </>
  )
}