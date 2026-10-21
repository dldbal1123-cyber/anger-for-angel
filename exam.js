/* ── 검사(테스트) 시작부터 처방전까지 — test_start_export2에서 옮김 ──
   "내 상태 확인하기"를 누르면 메인 위에 몰입형 전체화면 검사가 페이드로 열림.
   질문 → 발산 단계 → 트리거 상황 선택 → 트리거 유형 → 키워드 문장 → 처방전(앞/뒤 뒤집기) + 누적 통계.
   메인 카드 데이터(stages)와 이름이 겹치지 않도록 검사 단계 데이터는 EXAM_STAGES로 이름을 바꿈.
   ← 뒤로 / 분해소 / Esc 로 닫힘. */

/* ── 검사 데이터 ── */
const questions = [
  '화가 났을 때 나는 내 감정을\n바로 알아차리기 어렵다.',
  '나는 화가 나도\n아무렇지 않은 척하는 편이다.',
  '화가 쌓이면 두통, 답답함, 긴장 같은\n몸의 반응이 먼저 온다.',
  '나는 화가 나면\n말이나 행동으로 표현하기 시작한다.',
  '분노가 올라오면\n목소리나 태도가 강해지는 편이다.',
  '나는 화를 낸 뒤\n후회하는 경우가 있다.'
];

const EXAM_STAGES = [
  {id:'SILENT',ko:'무음',desc:'분노가 느껴지지 않고 감정이 차단된 상태. 몸이 먼저 반응한다.',symptom:'무표정, 손발 차가워짐, 순간적인 기억 공백.',prescription:'감각을 깨우는 것부터.',
    rxAction:'감각부터 확인하라.<br>발바닥이 바닥에 닿는 느낌을 살피고, 턱과 어깨에 힘이 들어가 있는지 확인한다. 지금 상태와 가까운 단어를 하나 고른다. \'불편함\', \'답답함\', \'잘 모르겠음\'도 가능하다.',
    rxPrinciple:'감정에 이름을 붙이기 어렵다면 현재의 감각부터 관찰한다. 무엇을 느끼는지 서둘러 결론 내리지 않고, 내 상태를 알아차리는 출발점을 만든다.',
    rxCaution:'아무 감정도 떠오르지 않아도 괜찮다. 화를 찾아내려 애쓰거나 불편했던 기억을 억지로 꺼내지 말 것.'},
  {id:'MURMUR',ko:'웅얼거림',desc:'분노를 느끼지만 혼자 삭히는 패턴. 안으로 돌리며 자책으로 전환되기 쉽다.',symptom:'두통, 소화불량, 잦은 한숨.',prescription:'표현의 출구 만들기.',
    rxAction:'삼킨 말을 밖에 적어라.<br>메모에 \'나는 ___ 때문에 ___했다\'를 완성한다. 이어서 \'사실 내가 바랐던 것은 ___이다\'를 적는다. 지금은 전달하지 않고 나만 읽어도 된다.',
    rxPrinciple:'머릿속에서 반복되던 생각을 문장으로 꺼내 상황·감정·바람을 구분한다. 상대에게 말하기 전에 자신이 무엇을 전하고 싶은지 정리하는 과정이다.',
    rxCaution:'문장을 잘 쓰거나 감정을 정당화할 필요는 없다. 같은 장면을 되짚을수록 더 격해진다면 기록을 멈추고 잠시 쉴 것.'},
  {id:'SHOUT',ko:'외침',desc:'분노가 쌓이고 있다는 것을 알지만 표현이 어렵다. 신체 증상으로 나타난다.',symptom:'어깨 결림, 이 악물기, 말끝 흐리기.',prescription:'작은 표현부터 연습.',
    rxAction:'작은 요구 하나를 말하라.<br>정리한 마음에서 가장 중요한 요구 하나를 고른다. \'나는 ___해서 불편했어. 다음에는 ___해 줬으면 해\'라는 문장으로 적고, 편안한 크기의 목소리로 연습한다.',
    rxPrinciple:'막연한 불편함을 상대가 이해할 수 있는 구체적인 요청으로 바꾼다. 표현의 크기보다 전달할 내용과 행동을 분명히 하는 데 목적이 있다.',
    rxCaution:'\'항상\', \'절대\', \'너 때문에\'처럼 상대 전체를 평가하는 말은 잠시 내려놓을 것. 직접 말하기 어려운 관계라면 글이나 신뢰할 수 있는 사람의 도움을 선택해도 된다.'},
  {id:'ROAR',ko:'포효',desc:'분노가 밖으로 나오기 시작하는 단계. 방향을 찾는 중이며 에너지가 있다.',symptom:'목소리 커짐, 심장 박동 상승, 손짓 커짐.',prescription:'분노가 가리키는 방향 찾기.',
    rxAction:'분노의 방향을 하나로 좁혀라.<br>말을 잠시 멈추고 \'일어난 일\'과 \'바꾸고 싶은 점\'을 한 줄씩 적는다. 여러 불만 중 이번에 다룰 문제 하나를 고르고, 목소리를 낮출 수 있을 때 요청을 전달한다.',
    rxPrinciple:'강해진 표현을 해결하고 싶은 문제에 연결한다. 한 번에 다루는 범위를 줄여 비난이 이어지는 대신 구체적인 대화를 시작하도록 돕는다.',
    rxCaution:'지난 갈등을 한꺼번에 꺼내거나 즉시 답을 요구하지 말 것. 언성이 계속 높아진다면 대화를 중단하고 다시 이야기할 시간을 정할 것.'},
  {id:'BLAST',ko:'폭음',desc:'분노가 자주 강하게 나온다. 에너지가 많고 주변에 영향을 미친다.',symptom:'얼굴 붉어짐, 호흡 가빠짐, 언성 높아짐.',prescription:'에너지를 쏟을 창구 찾기.',
    rxAction:'해결보다 먼저 멈춰라.<br>대화와 메시지 전송을 멈추고 안전한 거리를 확보한다. 가능하다면 \'지금은 진정할 시간이 필요해. 가라앉으면 다시 이야기하자\'고 알린다. 편안하게 호흡하며 다음 행동을 고를 여유가 생길 때까지 쉰다.',
    rxPrinciple:'강한 감정과 즉각적인 행동 사이에 간격을 만든다. 당장 결론을 내리기보다, 자신과 주변을 해치지 않는 대응을 선택할 시간을 확보한다.',
    rxCaution:'물건을 치거나 위협하는 행동으로 풀지 말 것. 격한 상태에서는 운전·중요한 결정·공개 게시를 미룰 것. 자신이나 타인을 해칠 것 같다면 즉시 주변에 도움을 요청할 것.'}
];

const TRIGGER_SET_A = [
  { id:'CASE-A01', subtitle:'나만 알기로 한 이야기',
    illustCaption:'INTERPERSONAL TRUST / PRIVATE RECORD',
    body:'너무 힘든 마음에 믿는 친구 한 명에게만 속마음을 털어놨다. 그런데 어느새 다른 사람들도 그 얘기를 알고 있다. 심지어 이야기는 부풀려져 있었다.',
    a:{tag:'진심 무시형', text:'힘들어서 꺼낸 진심이\n가십거리가 된 것'},
    b:{tag:'침범/경계형', text:'나만 알기로 한 이야기가\n허락 없이 퍼진 것'}
  },
  { id:'CASE-A02', subtitle:'"좋아하는 일이잖아"',
    illustCaption:'PROFESSIONAL VALUE / LABOR DEPRECIATION',
    body:'몇 년 동안 갈고닦은 실력이다. 그런데 아는 사람이 말한다. "좋아하는 일이잖아, 친한 사이에 그냥 좀 해 주면 안 돼?"',
    a:{tag:'진심 무시형', text:'내 노력을 "좋아서 하는 거잖아"로\n가볍게 여기는 것'},
    b:{tag:'불공정형', text:'친하다는 이유로\n내 실력을 공짜로 쓰려는 것'}
  },
  { id:'CASE-A03', subtitle:'"어쩌라고요?"',
    illustCaption:'PUBLIC ORDER / RULE VIOLATION',
    body:'모두가 함께 쓰는 공간에서 한 사람이 규칙을 무시하고 있다. 조심스럽게 한마디 했더니 "어쩌라고요?"가 돌아온다.',
    a:{tag:'불공정형', text:'규칙은 무시하고\n자기만 편하게 행동하는 것'},
    b:{tag:'감정 억압형', text:'화가 나도 일이 커질까 봐\n참아야 하는 것'}
  },
  { id:'CASE-A04', subtitle:'"다 너를 위해서 하는 말이야"',
    illustCaption:'IDENTITY CONTROL / AUTONOMY DENIAL',
    body:'오래 고민해서 진로를 정했다. 그런데 가족은 "다 너 잘되라고 하는 말이야"라며 계속 참견한다. 내 생각은 묻지 않고, 자기들이 원하는 쪽으로 바꾸라고만 한다.',
    a:{tag:'침범/경계형', text:'내 선택인데 뜻대로 못 하고\n계속 간섭받는 것'},
    b:{tag:'고립/한계형', text:'내 선택을 이해해 주는 사람이\n한 명도 없는 것'}
  },
  { id:'CASE-A05', subtitle:'아무 일 없다는 듯 웃는 사람',
    illustCaption:'PERPETRATOR IMAGE / EMOTIONAL LABOR',
    body:'나에게 큰 상처를 준 사람이 아무 일 없었다는 듯 웃으며 분위기를 맞춘다.',
    a:{tag:'감정 억압형', text:'화가 안 풀렸는데\n괜찮은 척해야 하는 것'},
    b:{tag:'고립/한계형', text:'잘못한 사람은 멀쩡한데\n나만 감정을 감당하는 것'}
  }
];

const TRIGGER_SET_B = [
  { id:'CASE-B01', subtitle:'"너 변했다?"',
    illustCaption:'GOODWILL EXPLOITATION / BOUNDARY EROSION',
    body:'처음엔 그냥 도와주고 싶어서 도와줬다. 그런데 상대는 그게 당연해졌고, 한 번 거절하자 "너 변했다?"라고 한다.',
    a:{tag:'진심 무시형', text:'좋은 마음으로 한 일을\n당연하게 여기는 것'},
    b:{tag:'침범/경계형', text:'도와준다는 이유로\n내 시간과 힘을 계속 가져가는 것'}
  },
  { id:'CASE-B02', subtitle:'밤새 일한 사람은 따로 있는데',
    illustCaption:'CONTRIBUTION ERASURE / CREDIT THEFT',
    body:'같이 한 일인데 내가 대부분을 했다. 그런데 중간에 빠졌던 사람이 발표 날에만 나타나 공을 가져간다.',
    a:{tag:'불공정형', text:'내가 한 일을\n다른 사람이 인정받는 것'},
    b:{tag:'감정 억압형', text:'뻔히 보이는데도 말 못 하고\n웃고 있어야 하는 것'}
  },
  { id:'CASE-B03', subtitle:'"뭘 그렇게 유난을 떨어요?"',
    illustCaption:'SPACE INVASION / REVERSED BLAME',
    body:'사람 많은 길에서 누군가 길을 막고 서 있다. "죄송한데 좀 지나갈게요"라고 했더니 "뭘 그렇게 유난을 떨어요?"라고 한다.',
    a:{tag:'침범/경계형', text:'다른 사람은 생각 않고\n길을 막고 서 있는 것'},
    b:{tag:'불공정형', text:'잘못은 자기가 해 놓고\n나를 이상한 사람 취급하는 것'}
  },
  { id:'CASE-B04', subtitle:'조언인지 참견인지',
    illustCaption:'CHOICE DEPRECIATION / COLLECTIVE ISOLATION',
    body:'오래 고민해서 하나를 골랐는데, 친구는 "다 너 생각해서 하는 말이야"라며 계속 별로라고 한다.',
    a:{tag:'진심 무시형', text:'내 고민은 모르고\n선택을 대수롭지 않게 여기는 것'},
    b:{tag:'고립/한계형', text:'내 선택을 존중해 주는 사람 없이\n혼자 버티는 것'}
  },
  { id:'CASE-B05', subtitle:'"나는 몰랐는데?"',
    illustCaption:'RESPONSIBILITY SHIFT / EMOTIONAL SUPPRESSION',
    body:'갑자기 일이 터졌는데 한 명씩 "나는 몰랐는데?"라며 슬쩍 빠져나간다. 결국 만만한 나에게 일이 몰린다.',
    a:{tag:'고립/한계형', text:'다 같이 할 일을\n나 혼자 떠안게 된 것'},
    b:{tag:'감정 억압형', text:'속으로는 화가 나는데\n일부터 해결하려고 참는 것'}
  }
];

const TYPE_SENTENCE = {
  '진심 무시형':'진심이 짓밟히는 상황',
  '침범/경계형':'경계가 무너지는 상황',
  '불공정형':'불공정한 구조에 놓이는 상황',
  '감정 억압형':'나를 지워야 하는 상황',
  '고립/한계형':'혼자 버텨야 하는 상황'
};
const TYPE_NOTE = {
  '진심 무시형':'이 대상자의 분노는 감정과 진심이 평가절하될 때 가장 강하게 작동한다.',
  '침범/경계형':'이 대상자의 분노는 자신의 영역과 의사결정권이 침해될 때 가장 강하게 작동한다.',
  '불공정형':'이 대상자의 분노는 공정한 규칙과 기준이 무너지는 순간 가장 강하게 작동한다.',
  '감정 억압형':'이 대상자의 분노는 자신을 지우고 맞춰야 할 때 가장 강하게 작동한다.',
  '고립/한계형':'이 대상자의 분노는 혼자 감당해야 하거나 아무도 없다고 느낄 때 가장 강하게 작동한다.'
};
const TRIGGER_RX = {
  '진심 무시형':'인정받지 못한 마음을 기록하라. 증거를 남기는 것 자체가 처방이다.',
  '침범/경계형':'경계선을 물리적으로 그어라. 거리·공간·시간을 스스로 확보하라.',
  '불공정형':'구조를 향해 써라. 개인이 아닌 시스템에 항의문을 써봐라.',
  '감정 억압형':'몸으로 먼저 말하게 하라. 표정, 목소리, 몸짓을 크게 써봐라.',
  '고립/한계형':'혼자 짊어진 것을 눈에 보이게 나열하라. 목록으로 만들어라.'
};

const TYPE_MAP_ALL = {
  '진심 무시형':{x:65,y:38,intensity:4,keyword:'진심이 무시될 때'},
  '침범/경계형':{x:28,y:26,intensity:5,keyword:'경계를 침범당할 때'},
  '불공정형':   {x:72,y:24,intensity:4,keyword:'불공정한 상황'},
  '감정 억압형':{x:25,y:70,intensity:3,keyword:'감정을 숨길 때'},
  '고립/한계형':{x:32,y:74,intensity:3,keyword:'혼자 감당할 때'}
};

const RX_CONVERT = {
  SILENT:{
    type:'광휘형 에너지',
    tags:['정제력','응축되는 빛','투명도'],
    body:'<u>무음</u> 단계에서 관측된 에너지는<br>방치 시 마비, 방향 설정 시 <u>광휘형</u>으로 전이된다.',
    actions:[
      {name:'정밀 기록',desc:'지금 느껴지는(혹은 안 느껴지는) 감각을 최대한 구체적인 단어로 적는다.<br>뭉뚱그리지 않는다.',quote:'이름 붙이지 못한 것은 계속 무게로 남는다.'},
      {name:'극단적 대비',desc:'아주 차갑거나 뜨거운 것에 손을 잠깐 대본다.<br>몸이 먼저 반응하게 만든다.',quote:'감각이 돌아오면, 감정도 따라온다.'},
      {name:'소리 내어 읽기',desc:'아무 텍스트나 골라 1분간 소리 내어 읽는다.<br>목소리의 존재를 확인한다.',quote:'목소리가 있다는 걸 몸에게 알려준다.'}
    ],
    cases:[
      {id:'CASE - 02',desc:'피험자, 무표정 상태 지속 중 손바닥에 얼음 쥠.<br>47초 후 표정 변화 관측.'},
      {id:'CASE - 08',desc:'피험자, 감정 무반응 구간에서 낯선 언어로<br>혼잣말 시도. 이후 대화량 증가.'},
      {id:'CASE - 14',desc:'피험자, 일기 작성 중 형용사 사용 빈도 급증.<br>3일 연속 기록 지속됨.'}
    ]
  },
  MURMUR:{
    type:'링형 에너지',
    tags:['순환력','반복되는 궤도','지속력'],
    body:'<u>웅얼거림</u> 단계에서 관측된 에너지는<br>억제 시 침묵으로 퇴행, 방향 설정 시 <u>링형</u>으로 전이된다.',
    actions:[
      {name:'루틴 뒤집기',desc:'오늘 하루 순서를 평소와 정반대로 바꿔 진행한다.<br>반복을 눈치채게 만든다.',quote:'같은 길을 돌고 있다는 걸, 길을 바꿔야 알게 된다.'},
      {name:'반복 기록',desc:'오늘 세 번 이상 떠오른 같은 생각을 따로 적어 모은다.',quote:'맴도는 것도 적어두면 패턴이 된다.'},
      {name:'한 사람에게 옮기기',desc:'혼자 삭히던 이야기를 오늘 한 사람에게<br>짧게라도 꺼낸다.',quote:'안에서만 돌던 것을, 밖으로 한 바퀴 내보낸다.'}
    ],
    cases:[
      {id:'CASE - 05',desc:'피험자, 3주간 반복하던 혼잣말 패턴을<br>메모앱에 옮겨 기록. 반복 빈도 감소 보고됨.'},
      {id:'CASE - 11',desc:'피험자, 동일 고민 다섯 번째 재생 직후<br>지인에게 전화. 통화 후 수면 개선 관측.'},
      {id:'CASE - 17',desc:'피험자, 출퇴근 경로 역순 시도.<br>도착 후 "낯설다"는 표현 반복 사용됨.'},
      {id:'CASE - 27',desc:'피험자, SNS 습관 중단 후 보이스 메모<br>매일 기록. 한 달간 메모 길이 점진적 증가.'},
      {id:'CASE - 33',desc:'피험자, 회의 중 의견 제시 빈도 증가.<br>발언 시간 3개월 대비 200% 상승.'},
      {id:'CASE - 39',desc:'피험자, 일상적 상황에서 의도적으로<br>짧은 대화 시도. 이후 야외활동 참여도 증가.'}
    ]
  },
  SHOUT:{
    type:'링형 에너지',
    tags:['순환력','반복되는 궤도','지속력'],
    body:'<u>외침</u> 단계에서 관측된 에너지는<br>억제 시 웅얼거림으로 재침전, 방향 설정 시 <u>링형</u>으로 전이된다.',
    actions:[
      {name:'몸짓 반복',desc:'참았던 말 대신 같은 동작을 정해진 횟수만큼 반복한다<br>(문 두드리기, 손뼉 등).',quote:'말 대신 몸이 먼저 순환을 끝낸다.'},
      {name:'미완성 문장 완성하기',desc:'"사실 나는 ___"로 시작하는 문장을 오늘<br>다섯 번 다른 버전으로 완성한다.',quote:'다 못한 말은 여러 번 쪼개서라도 끝내야 한다.'},
      {name:'정기 발산 예약',desc:'이번 주 안에 크게 말할 수 있는 시간을<br>일정에 미리 고정해둔다.',quote:'터질 시점을 스스로 정하면, 발산이 아니라 일정이 된다.'}
    ],
    cases:[
      {id:'CASE - 03',desc:'피험자, 어깨 결림 호소 직후 샌드백 대여.<br>2주 내 재방문율 감소.'},
      {id:'CASE - 09',desc:'피험자, 미완성 문자 초안 5개 작성 후<br>1개 실제 발송. 답장 수신 후 긴장도 하락.'},
      {id:'CASE - 21',desc:'피험자, 주간 일정에 "혼자 크게 말하는<br>시간" 고정 배치. 4주 지속 확인됨.'},
      {id:'CASE - 27',desc:'피험자, SNS 습관 중단 후 보이스 메모<br>매일 기록. 한 달간 메모 길이 점진적 증가.'},
      {id:'CASE - 33',desc:'피험자, 회의 중 의견 제시 빈도 증가.<br>발언 시간 3개월 대비 200% 상승.'},
      {id:'CASE - 39',desc:'피험자, 일상적 상황에서 의도적으로<br>짧은 대화 시도. 이후 야외활동 참여도 증가.'}
    ]
  },
  ROAR:{
    type:'날개형 에너지',
    tags:['추진력','멀리 뻗어나가는 힘','상승'],
    body:'<u>포효</u> 단계에서 관측된 에너지는<br>억제 시 침전, 방향 설정 시 <u>날개형</u>으로 전이된다.',
    actions:[
      {name:'홧김 해지',desc:'안 쓰는 구독, 질질 끌던 약속,<br>미루던 탈퇴를 지금 전부 끊는다.',quote:'붙잡고 있던 것들이 무게였다는 걸, 놓고 나서야 안다.'},
      {name:'즉흥 예약',desc:'떠나버리고 싶다는 충동을 실제 티켓으로 바꾼다.<br>당일치기, 근교, 상관없다.',quote:'멀리 갈 필요 없다. 지금 떠난다는 사실이 중요하다.'},
      {name:'인맥 정리',desc:'연락 끊긴 지 오래된 단톡방,<br>굳이 안 봐도 되는 팔로우를 오늘 정리한다.',quote:'날개는 가벼워야 움직인다.'}
    ],
    cases:[
      {id:'CASE - 07',desc:'피험자, 포효 직후 편도 항공권 결제.<br>3주 후 낯선 도시 정착 시도 보고됨.'},
      {id:'CASE - 13',desc:'피험자, 발산 24시간 내 미루던 자격증<br>시험 접수 완료. 재발 없음.'},
      {id:'CASE - 19',desc:'피험자, 방 전체 재배치. 이후 대화에서<br>"새 방"이라는 표현 반복 사용됨.'},
      {id:'CASE - 23',desc:'피험자, 발산 직후 즉흥곡 1곡 작성.<br>제목: 〈그날의 소리〉.'},
      {id:'CASE - 31',desc:'피험자, 3년간 미뤄온 이별 통보 실행.<br>통보 후 수면 패턴 정상화 관측됨.'}
    ]
  },
  BLAST:{
    type:'날개형 에너지',
    tags:['추진력','멀리 뻗어나가는 힘','상승'],
    body:'<u>폭음</u> 단계에서 관측된 에너지는<br>방치 시 소진, 방향 설정 시 <u>날개형</u>으로 전이된다.',
    actions:[
      {name:'완전 탈퇴',desc:'오랫동안 미뤄온 계정, 멤버십, 소속에서<br>완전히 나온다. 되돌릴 수 없는 결정으로.',quote:'다시 들어갈 문이 없어야, 진짜로 나온 것이다.'},
      {name:'전면 공개',desc:'숨겨왔던 입장이나 의견을 이번엔<br>숨기지 않고 공개적으로 밝힌다.',quote:'터진 에너지는 숨길수록 다시 쌓인다.'},
      {name:'새 판 짜기',desc:'기존 계획을 버리고 오늘 안에 완전히 새로운<br>계획을 세워 첫 단계를 바로 실행한다.',quote:'판을 다 갈아엎는 것도, 방향을 정하는 일이다.'}
    ],
    cases:[
      {id:'CASE - 04',desc:'피험자, 5년 소속 단체 탈퇴서 즉시 제출.<br>이후 신규 활동 3건 시작 보고됨.'},
      {id:'CASE - 16',desc:'피험자, 비공개로 유지하던 입장문 게시.<br>게시 후 수면 패턴 정상화 관측.'},
      {id:'CASE - 25',desc:'피험자, 기존 사업계획 폐기 후 신규안<br>작성 착수. 착수 48시간 내 실행 1단계 완료.'}
    ]
  }
};

/* ── 이미지 경로 ── */
const CARD_IMAGES = {
  2: 'images/exam/card-icon-murmur.png',
  3: 'images/exam/card-icon-shout.png',
  4: 'images/exam/card-icon-roar.png',
  5: 'images/exam/card-icon-blast.png'
};
const ANGEL_SILENT_IMG = 'images/exam/card-icon-silent.png';
const RX_TYPE_IMG_RING = 'images/exam/rx-type-ring.png';
const RX_TYPE_IMG_GLOW = 'images/exam/rx-type-glow.png';
const RX_TYPE_IMG_WING = 'images/exam/rx-type-wing.png';
const ILLUST = {
  a1:'images/exam/illust-a1.png', a2:'images/exam/illust-a2.png', a3:'images/exam/illust-a3.png',
  a4:'images/exam/illust-a4.png', a5:'images/exam/illust-a5.png',
  b1:'images/exam/illust-b1.png', b2:'images/exam/illust-b2.png', b3:'images/exam/illust-b3.png',
  b4:'images/exam/illust-b4.png', b5:'images/exam/illust-b5.png'
};

/* ── 슬라이드 엔진 ── */

/* 모션 시간 (exam.css의 '모션 시간 통일' 블록과 같은 값) */
const ES_MOTION = {
  enter: 560,        // 메인 → 검사 진입 / 나가기 (큰 장면 전환)
  slide: 280,        // 검사 문항 교체 (16px 이동 + 페이드)
  pick: 130,         // 답변 선택 표시 후 다음으로
  reveal: 520,       // 결과 공개
  revealStep: 120    // 결과 공개: 결과 먼저, 보조 요소는 이 간격으로 뒤따라 정착
};

/* 결과 공개: 첫 요소(결과)를 먼저 보여주고, 나머지 보조 요소가 차례로 정착 */
function esReveal(items){
  const list = items.filter(Boolean);
  list.forEach(([el, , from]) => { el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = from; });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    list.forEach(([el, delay]) => {
      const ease = 'cubic-bezier(.22,1,.36,1)';
      el.style.transition = `opacity ${ES_MOTION.reveal}ms ${ease} ${delay}ms, transform ${ES_MOTION.reveal}ms ${ease} ${delay}ms`;
      el.style.opacity = '1';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, delay + ES_MOTION.reveal + 60);
    });
  }));
}
function esRevealSlide(container){
  if(!container) return;
  const big = container.querySelector('.es-big');
  const rest = Array.from(container.children).filter(el => el !== big);
  esReveal([[big, 0, 'translateY(12px)'], ...rest.map((el, i) => [el, ES_MOTION.revealStep * (i + 1), 'translateY(8px)'])].filter(x => x[0]));
}
const ES_LIKERT = ['전혀 아니다','아니다','보통이다','그렇다','매우 그렇다'];

const ES = {answers:[], picks:{}, stage:null, type:null, kwKeyword:'', kwStage:''};
let esSlides = [], esCur = 0, esLock = false, esSessionBumped = false;

/* ── 누적 통계 (로컬 저장) ── */
const LS_KEY = 'bunhaeso_trigger_stats';
function getStats(){
  try{ return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }catch{ return {}; }
}
function saveStats(s){ localStorage.setItem(LS_KEY, JSON.stringify(s)); }
function addStat(type){
  const s = getStats();
  s[type] = (s[type]||0) + 1;
  saveStats(s);
}

let triggerSessionCount = parseInt(localStorage.getItem('bunhaeso_session_count') || '0');
let currentSet = triggerSessionCount % 2 === 0 ? TRIGGER_SET_A : TRIGGER_SET_B;

function findTriggerType(kw){
  for(const k in TYPE_MAP_ALL){ if(TYPE_MAP_ALL[k].keyword === kw) return k; }
  for(const k in TYPE_SENTENCE){ if(TYPE_SENTENCE[k] === kw) return k; }
  return null;
}

function getStageByScore(total){
  const avg = total / questions.length;
  if(avg < 1.8) return EXAM_STAGES[0];
  if(avg < 2.6) return EXAM_STAGES[1];
  if(avg < 3.4) return EXAM_STAGES[2];
  if(avg < 4.2) return EXAM_STAGES[3];
  return EXAM_STAGES[4];
}

/* 'CASE A01' 표시: 산돌 격동고딕2로 뽑은 이미지(images/glyph/case-a01.png …)를 마스크로. 폭(px)은 이미지와 같게 */
const ES_CASE_NO_W = { a01:113, a02:119, a03:120, a04:120, a05:120, b01:114, b02:120, b03:121, b04:121, b05:121 };
function esCaseNoStyle(id){
  const k = String(id).replace('CASE-', '').toLowerCase();
  const w = ES_CASE_NO_W[k];
  if(!w) return '';
  const u = `url('images/glyph/case-${k}.png')`;
  return ` style="width:${w}px;-webkit-mask-image:${u};mask-image:${u}"`;
}

function esImgKey(id){
  const k = id.replace('CASE-','').replace('-','').toLowerCase();
  return k.replace(/^([ab])0*(\d)$/, '$1$2');
}

function esBuildSlides(){
  const arr = [];
  questions.forEach((q,i) => arr.push({kind:'q', i}));
  arr.push({kind:'stage'});
  currentSet.forEach((c,i) => arr.push({kind:'case', i}));
  arr.push({kind:'type'});
  arr.push({kind:'sentence'});
  arr.push({kind:'rx'});
  return arr;
}

function esBg(kind, i){
  if(kind === 'q') return 'es-bg-blue';   // 검사 질문 6개는 하늘색 바탕으로 고정
  if(kind === 'case') return 'es-bg-black';
  if(kind === 'sentence') return 'es-bg-black';
  if(kind === 'rx') return 'es-bg-blue';
  return 'es-bg-white';
}

function esHtml(s){
  if(s.kind === 'q'){
    const i = s.i;
    return `<div class="es-inner"><div class="es-qnum">QUESTION ${String(i+1).padStart(2,'0')} / ${String(questions.length).padStart(2,'0')}</div><h2 class="es-q">${questions[i].replace(/\n/g, '<br>')}</h2><div class="es-opts es-likert">${ES_LIKERT.map((l,v)=>`<button class="es-opt" onclick="esAnswer(${i},${v+1},this)"><span>${l}</span><small>${v+1}</small></button>`).join('')}</div></div>`;
  }
  if(s.kind === 'stage') return `<div class="es-inner" id="esStageSlide"></div>`;
  if(s.kind === 'case'){
    // 트리거 관찰 기록 (1466×655): 왼쪽 일러스트+대사+상황 / 오른쪽 CASE·질문·A/B·진행 막대·이전/다음
    const c = currentSet[s.i];
    const img = ILLUST[esImgKey(c.id)];
    const peek = (cc, side) => {
      const im = cc && ILLUST[esImgKey(cc.id)];
      return im ? `<div class="es-cs-peek es-cs-peek-${side}" style="background-image:url('${im}')" aria-hidden="true"></div>` : '';
    };
    const segs = currentSet.map((_, k) => `<i class="${k < s.i ? 'is-done' : k === s.i ? 'is-cur' : ''}"></i>`).join('');
    const opts = ['a', 'b'].map(k => `<button class="es-opt es-cs-opt" onclick="esPick(${s.i},'${k}',this)"><span class="es-cs-k">${k.toUpperCase()}</span><span class="es-cs-text">${c[k].text.replace(/\n/g, '<br>')}</span><span class="es-cs-tag">${c[k].tag}</span></button>`).join('');
    return `${peek(currentSet[s.i-1], 'l')}${peek(currentSet[s.i+1], 'r')}
      <div class="es-cs">
        <h2 class="es-cs-title">트리거 관찰 기록 <img src="Group%20106.svg" alt="" class="es-cs-icon"></h2>
        <div class="es-cs-left">
          <div class="es-cs-illust">${img ? `<img src="${img}" alt="">` : ''}<p class="es-cs-quote">${esQuote(c.subtitle)}</p><i class="es-cs-corner tl"></i><i class="es-cs-corner br"></i></div>
          <p class="es-cs-body">${c.body}</p>
        </div>
        <div class="es-cs-divider"></div>
        <div class="es-cs-right">
          <div class="es-cs-no"${esCaseNoStyle(c.id)}>${c.id.replace('CASE-', 'CASE ')}</div>
          <h3 class="es-cs-q">이 상황에서 어느 부분이 더 자신의 트리거에 가까운지 고르시오</h3>
          <p class="es-cs-guide">자신의 반응에 더 가까운 쪽을 선택하십시오.</p>
          <div class="es-cs-opts">${opts}</div>
          <div class="es-cs-progress">${segs}</div>
          <div class="es-cs-nav">
            <button type="button" class="es-cs-prev" onclick="esBackStep()"><i></i>이전</button>
            <button type="button" class="es-cs-next" onclick="esCaseNext(${s.i})">다음<i></i></button>
          </div>
        </div>
      </div>`;
  }
  if(s.kind === 'type') return `<div class="es-inner" id="esTypeSlide"></div>`;
  if(s.kind === 'sentence') return `<div class="es-inner" id="esSentSlide"></div>`;
  if(s.kind === 'rx') return `<div class="es-inner" id="esRxSlide"></div>`;
}

function esCalcStage(){
  const sum = ES.answers.reduce((a,b) => a+b, 0);
  ES.stage = getStageByScore(sum);
}

function esRenderStage(){
  esCalcStage();
  const st = ES.stage;
  const idx = EXAM_STAGES.findIndex(x => x.id === st.id);
  const pct = EXAM_STAGES.length>1 ? Math.round(idx/(EXAM_STAGES.length-1)*100) : 50;
  document.getElementById('esStageSlide').innerHTML = `<div class="es-tag">발산 단계</div><div class="es-big">${st.ko}</div><div class="es-en">${st.id}</div><p class="es-desc">${st.desc}</p><p class="es-desc" style="opacity:.75">증상 — ${st.symptom}</p><div class="es-stats" style="margin-top:20px"><div class="es-stat-bar-wrap"><div class="es-stat-bar" style="width:${pct}%"></div></div></div><button class="es-next" onclick="esGo(esCur+1)">이제 <b>트리거</b>를 찾는다 →</button>`;
  esRevealSlide(document.getElementById('esStageSlide'));
  ES.kwStage = st.ko + '형';
}

function esCalcType(){
  const types = Object.entries(ES.picks).map(([i,opt]) => currentSet[i][opt].tag);
  const freq = {};
  types.forEach(t => freq[t] = (freq[t]||0) + 1);
  const dominant = Object.entries(freq).sort((a,b) => b[1]-a[1])[0];
  ES.type = dominant ? dominant[0] : Object.keys(TYPE_SENTENCE)[0];
  ES.kwKeyword = TYPE_MAP_ALL[ES.type] ? TYPE_MAP_ALL[ES.type].keyword : ES.type;
  return freq;
}

function esRenderType(){
  if(!esSessionBumped){
    esSessionBumped = true;
    triggerSessionCount = parseInt(localStorage.getItem('bunhaeso_session_count') || '0');
    localStorage.setItem('bunhaeso_session_count', String(triggerSessionCount+1));
  }
  const freq = esCalcType();
  const allTypes = Object.keys(TYPE_SENTENCE);
  document.getElementById('esTypeSlide').innerHTML = `<div class="es-tag">분노 트리거</div><div class="es-big">${ES.type}</div><p class="es-desc">${TYPE_NOTE[ES.type]||''}</p><div class="es-chips">${allTypes.map(t=>`<span class="es-chip${t===ES.type?' es-chip-on':''}">${t} ${freq[t]||0}</span>`).join('')}</div><button class="es-next" onclick="esGo(esCur+1)">두 결과를 <b>합친다</b> →</button>`;
  esRevealSlide(document.getElementById('esTypeSlide'));
}

/* 키워드 분석: 검사 결과를 보여 주기만 함 (민감한 상황·분노 단계 칩은 누를 수 없음) */
function esRenderSentence(){
  const el = document.getElementById('esSentSlide');
  const kwOptions = Object.values(TYPE_MAP_ALL).map(v => v.keyword);
  el.innerHTML = `<div class="es-tag">키워드 분석</div><p class="es-sentence">나는 <span class="es-fill-blue">${ES.kwKeyword}</span>에 민감하여<br><span class="es-fill-blue">${ES.kwStage}</span> 분노를 가지고 있다.</p><div class="es-chips-h">민감한 상황</div><div class="es-chips">${kwOptions.map(k=>`<span class="es-chip es-chip-static${k===ES.kwKeyword?' es-chip-on':''}">${k}</span>`).join('')}</div><div class="es-chips-h">분노 단계</div><div class="es-chips">${EXAM_STAGES.map(s=>`<span class="es-chip es-chip-static${(s.ko+'형')===ES.kwStage?' es-chip-on':''}">${s.ko}</span>`).join('')}</div><button class="es-next" onclick="esGo(esCur+1)"><b>처방전</b> 받기 →</button>`;
}

function esStatsHtml(){
  const stats = getStats();
  const all = Object.keys(TYPE_SENTENCE);
  const max = Math.max(1, ...all.map(t => stats[t]||0));
  return `<div class="es-stats"><div class="es-stats-label">누적 분류 기록 · CUMULATIVE</div>${all.map(t=>{
    const n = stats[t]||0, pct = Math.round((n/max)*100);
    return `<div class="es-stat-row"><span class="es-stat-name">${t}</span><span class="es-stat-bar-wrap"><span class="es-stat-bar" style="width:${pct}%"></span></span><span class="es-stat-count">${n}</span></div>`;
  }).join('')}</div>`;
}

function esRenderRx(){
  const type = findTriggerType(ES.kwKeyword) || ES.type;
  const stageObj = EXAM_STAGES.find(s => (s.ko+'형') === ES.kwStage) || ES.stage;
  const stageIdx = Math.max(0, EXAM_STAGES.indexOf(stageObj));
  const scalePct = EXAM_STAGES.length>1 ? (stageIdx/(EXAM_STAGES.length-1)*100) : 0;
  const ticks = EXAM_STAGES.map((_,i) => `<span class="es-rx-scale-tick" style="left:${i/(EXAM_STAGES.length-1)*100}%"></span>`).join('');
  const rxBg = '<svg class="es-rx-bg" viewBox="0 0 480 1259.594" preserveAspectRatio="none" aria-hidden="true"><path d="M480 221.947C480 226.053 476.672 229.381 472.566 229.381C468.461 229.381 465.133 232.709 465.133 236.814V243.187C465.133 247.292 468.461 250.62 472.566 250.62C476.672 250.62 480 253.948 480 258.054V1248.974C480 1254.839 475.246 1259.594 469.381 1259.594H10.6195C4.75452 1259.594 0 1254.839 0 1248.974V257.523C0 253.711 3.0905 250.62 6.90283 250.62C10.7152 250.62 13.8057 247.53 13.8057 243.717V236.284C13.8057 232.471 10.7152 229.381 6.90283 229.381C3.0905 229.381 0 226.29 0 222.478V10.6195C0 4.7545 4.7545 0 10.6195 0H469.381C475.245 0 480 4.7545 480 10.6195V221.947Z" fill="#EEEEEE" stroke="#121212" stroke-width="1.6"/></svg>';
  const wingSvg = '<svg class="es-rx-wing" viewBox="0 0 36 28" fill="none" aria-hidden="true"><path d="M13.4917 7.0077C13.4917 7.0077 15.9809 -0.17088 19.1577 0.00311253C22.3344 0.177105 22.0286 1.15932 22.0286 1.15932L21.9247 1.27157C21.9387 1.37541 21.9247 1.49046 21.877 1.55782L21.5515 2.02367C21.5515 2.02367 21.5403 2.0377 21.5346 2.04612C20.8667 2.85995 20.2016 3.64011 19.5758 4.49043C17.8415 6.85054 16.4973 9.2724 15.2765 11.9272C14.0053 14.6886 12.6442 18.494 12.6442 21.5108C12.6442 22.9673 12.9052 24.6426 13.9211 25.709C14.7518 26.5762 15.9613 26.767 17.0838 26.4022C17.7433 26.1861 18.341 25.8662 18.9051 25.4677C19.7695 24.8559 20.081 24.2975 20.7601 23.4836C20.8695 23.3545 20.9509 23.1497 21.0211 22.9055C21.254 22.0692 22.3401 21.8503 22.8901 22.5211C22.9967 22.653 23.0052 22.8438 22.9041 22.9813C22.6487 23.3321 22.3653 23.6745 22.065 24.0196C21.2568 24.9429 20.384 25.782 19.3541 26.4555C17.791 27.4798 15.8238 28.1197 13.9772 27.7268C12.1335 27.3339 10.9772 25.9672 10.4469 24.2105C9.72282 21.8026 9.97539 18.8055 10.5198 16.35C11.0923 13.785 11.6676 11.3659 12.8014 8.99738L13.4917 7.0077Z" fill="#EEEEEE"/><path d="M19.1949 19.5099C19.1248 19.4032 19.0714 19.2854 19.0349 19.1647C18.8778 18.6736 18.6982 18.2049 18.5831 17.6942C18.2632 16.277 18.6589 15.0198 19.5794 13.9225C20.1968 13.1872 25.0433 10.2855 25.7673 9.64285C27.1508 8.41368 28.4867 7.16767 29.8112 5.87676L31.133 4.51569C32.0591 3.56435 32.887 2.55407 33.6896 1.49609C33.7738 1.38945 33.9197 1.32771 34.046 1.34455C34.4641 1.40909 34.6185 2.17241 34.6213 2.67755C34.6325 4.11719 33.8411 5.59332 32.9543 6.71024C32.3117 7.52127 31.5876 8.25372 30.8187 8.9553L31.9244 8.10498C32.9768 7.29676 33.9421 6.41557 34.8879 5.48387C34.9861 5.39127 35.1404 5.34917 35.2611 5.38565C35.6652 5.50913 35.7101 6.28648 35.64 6.78882C35.4435 8.21443 34.4501 9.56146 33.4117 10.5409C31.9076 11.9609 30.1227 13.0329 28.2986 14.1302C28.9974 14.0095 29.626 13.6896 30.2743 13.3949C31.6662 12.7579 32.9515 11.9749 34.1554 11.0376C34.2144 10.9927 34.3687 10.9871 34.4108 11.032C34.4529 11.0741 34.495 11.1919 34.4866 11.2705C34.4136 11.9356 34.1667 12.5418 33.8046 13.103C33.7822 13.1367 33.7569 13.1732 33.7345 13.2041L33.2742 13.8159C33.2434 13.8579 33.2125 13.8972 33.176 13.9337C32.5221 14.6549 31.7588 15.2218 30.9169 15.7045C30.8861 15.7213 30.8524 15.7382 30.8215 15.755L29.3847 16.4622C29.003 16.6278 28.6157 16.7793 28.2285 16.9196C28.119 16.9589 28.018 17.0094 27.9226 17.074C27.597 17.2929 27.2603 17.509 26.9151 17.7251C27.2182 17.6774 27.5185 17.6184 27.8216 17.5539C29.017 17.3041 30.1312 16.8916 31.2088 16.3303C31.2593 16.3023 31.3687 16.2994 31.408 16.3275C31.4529 16.3612 31.467 16.4987 31.4445 16.5604C31.2537 17.0852 30.9169 17.5006 30.5297 17.9019C28.9497 19.5323 26.5615 20.5145 24.3136 20.9383C24.2238 20.9551 24.1312 20.9664 24.0386 20.9664C23.3539 20.9523 22.7926 20.6212 22.4559 20.3602C22.4531 20.3293 21.8385 20.3602 21.4933 20.4977C21.2772 20.5819 21.0471 20.61 20.817 20.5847C20.1799 20.5145 19.6102 20.161 19.2651 19.6221L19.1893 19.5043L19.1949 19.5099Z" fill="#EEEEEE"/><path d="M10.3656 14.1526C9.97835 13.1199 8.93159 12.3145 8.0504 11.6438C7.20009 10.9983 6.39187 10.3473 5.6061 9.62603L4.23942 8.3716C3.16459 7.38658 2.21886 6.31176 1.29558 5.18642C1.09072 4.93666 0.888663 4.69812 0.61645 4.75986C0.529454 4.7795 0.400363 4.88053 0.349849 4.98437C-0.0879375 5.89362 0.170244 7.07227 0.610837 7.9731C1.28436 9.35101 2.44056 10.4062 3.67254 11.2958L4.44147 11.8514C4.30396 11.8571 4.20293 11.8318 4.09629 11.7841C3.47609 11.4978 2.92044 11.1527 2.35076 10.771C1.65198 10.3052 1.03459 9.78318 0.411588 9.22472C0.34143 9.16018 0.206727 9.10966 0.136568 9.13773C0.0776356 9.16018 0.00467121 9.28085 0.00186489 9.35943C-0.0458426 10.5914 0.829731 11.8711 1.71653 12.7158C3.27123 14.1947 5.33949 14.9159 7.43021 15.3341C7.05696 15.4295 6.72301 15.379 6.36942 15.365C4.96625 15.2303 3.63606 14.8542 2.3676 14.248C2.31147 14.22 2.1936 14.2228 2.15993 14.2565C2.03364 14.3743 2.21606 14.8065 2.38443 15.0647C2.64262 15.4632 2.95131 15.7831 3.29368 16.1227C4.24503 16.9646 5.33949 17.5988 6.54621 18.0197C6.83527 18.1208 7.12712 18.2134 7.41898 18.2976C6.60234 18.233 5.79412 18.0815 4.99712 17.8458C4.93819 17.8289 4.82313 17.8486 4.79226 17.8878C4.68843 18.0226 4.93819 18.421 5.14305 18.6484C5.46297 19.002 5.81938 19.2686 6.20945 19.5492C6.52096 19.7456 6.84649 19.9224 7.17764 20.0824C7.02048 20.2339 6.8072 20.3827 6.8072 20.6044C6.8072 20.8962 6.88859 20.9888 6.99803 21.1769C7.06258 21.2891 7.33479 21.4575 7.45546 21.5108C7.84554 21.682 8.03357 21.7297 8.41242 21.8504C8.79689 21.9514 9.1589 22.0244 9.50408 22.0665C9.3778 21.4547 9.35815 20.8289 9.35815 20.8289L9.34131 20.537C9.29922 19.5492 9.45357 18.682 9.45357 18.682C9.58546 17.7559 9.6893 16.8804 9.90819 16.002L10.3684 14.1554L10.3656 14.1526Z" fill="#EEEEEE"/><path d="M13.3315 19.884C13.2698 19.7493 13.0677 19.797 13.0734 19.9457C13.1014 20.6361 13.1688 21.6829 13.3343 22.289C13.5953 23.2488 13.8002 23.4424 14.0219 23.7399C14.2436 24.0374 14.9704 21.9354 14.9704 21.638C14.9704 21.3405 14.2997 21.4696 14.0977 21.3405C13.9686 21.2591 13.5953 20.4677 13.3315 19.884Z" fill="#EEEEEE"/></svg>';
  const angelSrc = stageIdx === 0 ? ANGEL_SILENT_IMG : CARD_IMAGES[stageIdx+1];
  const photoHtml = angelSrc ? `<img src="${angelSrc}" alt="">` : '';
  const conv = RX_CONVERT[stageObj ? stageObj.id : 'SILENT'] || RX_CONVERT.SILENT;
  const convTagsHtml = conv.tags.map(t => `<span class="es-rx-convert-tag">${t}</span>`).join('');
  const convActionsHtml = '<div class="es-rx-action-line es-rx-action-line-first"></div>' + conv.actions.map((a,i) => `<div class="es-rx-action-item"><div class="es-rx-action-num">${String(i+1).padStart(2,'0')}.</div><div class="es-rx-action-content"><div class="es-rx-action-name">${a.name}</div><p class="es-rx-action-desc">${a.desc}</p><p class="es-rx-action-quote">[ "${a.quote}" ]</p></div></div><div class="es-rx-action-line${i===conv.actions.length-1?' es-rx-action-line-last':''}"></div>`).join('');
  const convCasesHtml = conv.cases.map(c => `<div class="es-rx-action-line es-rx-case-line"></div><div class="es-rx-case-item"><div class="es-rx-case-id">${c.id}</div><p class="es-rx-case-desc">${c.desc}</p><div class="es-rx-case-mark">-***-</div></div>`).join('') + '<div class="es-rx-action-line es-rx-case-line"></div>';
  const convBoxImg = conv.type.includes('광휘') ? RX_TYPE_IMG_GLOW : conv.type.includes('링') ? RX_TYPE_IMG_RING : RX_TYPE_IMG_WING;
  document.getElementById('esRxSlide').innerHTML = `<div class="es-rx-result-title">처방전 결과</div><div class="es-rx es-rx-flip" id="esRxFlip" onclick="esFlipRx()" onmouseenter="esRxHoverAdjust(true)" onmouseleave="esRxHoverAdjust(false)"><div class="es-rx-flip-inner"><div class="es-rx-card-face es-rx-card-face-front">${rxBg}<div class="es-rx-body"><div class="es-rx-topbar"><b>Rx. 에너지 전환 처방</b><span>${ES.type} · ${stageObj?stageObj.ko:''}</span></div><div class="es-rx-quote">${wingSvg}<div class="es-rx-quote-text"><i></i><p>${type?(TRIGGER_RX[type]||'-'):'-'}</p><i></i></div></div><div class="es-rx-perf"></div><div class="es-rx-stagehead">${stageObj?'[ '+stageObj.ko+' 단계 처방 ]':''}</div>${esRxTeaser(conv.type)}<div class="es-rx-photo">${photoHtml}</div><div class="es-rx-scale"><span class="es-rx-scale-label l">억압</span><div class="es-rx-scale-track"><span class="es-rx-scale-line"></span>${ticks}<span class="es-rx-scale-cap l"></span><span class="es-rx-scale-cap r"></span><span class="es-rx-scale-dot" style="left:${scalePct}%"></span></div><span class="es-rx-scale-label r">발산</span></div><div class="es-rx-action"><b>행동 처방</b><p>${stageObj?stageObj.rxAction:''}</p></div><div class="es-rx-principle"><div class="es-rx-principle-row"><b>처방 원리</b><span class="es-rx-principle-dots"></span><span class="es-rx-principle-lead">감정 고조 감지 시 즉시 1회. 진정 후 재발 시 반복 가능.</span></div><p class="es-rx-principle-body">${stageObj?stageObj.rxPrinciple:''}</p></div><div class="es-rx-caution"><div class="es-rx-caution-title"><i>*</i>주의사항<i>*</i></div><div class="es-rx-caution-box"><p>${stageObj?stageObj.rxCaution:''}</p></div></div><div class="es-rx-perf2"><svg class="es-rx-notch es-rx-notch-l" viewBox="0 0 14.867 36.107" aria-hidden="true"><path d="M0 0C0 4.106 3.328 7.434 7.434 7.434C11.539 7.434 14.867 10.762 14.867 14.867V21.24C14.867 25.345 11.539 28.673 7.434 28.673C3.328 28.673 0 32.001 0 36.107" fill="var(--blue)" stroke="#121212" stroke-width="1.6"/></svg><svg class="es-rx-notch es-rx-notch-r" viewBox="0 0 14.867 36.107" aria-hidden="true"><path d="M0 0C0 4.106 3.328 7.434 7.434 7.434C11.539 7.434 14.867 10.762 14.867 14.867V21.24C14.867 25.345 11.539 28.673 7.434 28.673C3.328 28.673 0 32.001 0 36.107" fill="var(--blue)" stroke="#121212" stroke-width="1.6"/></svg></div><div class="es-rx-flip-hint">눌러서 처방 계속 보기<span>→</span></div></div></div><div class="es-rx-card-face es-rx-card-face-back">${rxBg}<div class="es-rx-body"><div class="es-rx-flip-hint es-rx-flip-hint-back"><span>←</span>처방으로 돌아가기</div><div class="es-rx-convert"><div class="es-rx-convert-title">전환 가능 유형</div><div class="es-rx-convert-value">[ ${conv.type} ]</div><div class="es-rx-convert-tags">${convTagsHtml}</div><div class="es-rx-convert-box"><img src="${convBoxImg}" alt="${conv.type}"></div><p class="es-rx-convert-body">${conv.body}</p><svg class="es-rx-feather" viewBox="0 0 420 7" fill="none" aria-hidden="true"><use href="#rxWA" x="0"/><use href="#rxWA" x="14"/><use href="#rxWA" x="28"/><use href="#rxWA" x="42"/><use href="#rxWA" x="56"/><use href="#rxWA" x="70"/><use href="#rxWA" x="84"/><use href="#rxWA" x="98"/><use href="#rxWA" x="112"/><use href="#rxWA" x="126"/><use href="#rxWA" x="140"/><use href="#rxWA" x="154"/><use href="#rxWA" x="168"/><use href="#rxWA" x="182"/><use href="#rxWA" x="196"/><use href="#rxWA" x="210"/><use href="#rxWA" x="224"/><use href="#rxWA" x="238"/><use href="#rxWA" x="252"/><use href="#rxWA" x="266"/><use href="#rxWA" x="280"/><use href="#rxWA" x="294"/><use href="#rxWA" x="308"/><use href="#rxWA" x="322"/><use href="#rxWA" x="336"/><use href="#rxWA" x="350"/><use href="#rxWA" x="364"/><use href="#rxWA" x="378"/><use href="#rxWA" x="392"/><use href="#rxWB" x="0"/><use href="#rxWB" x="14"/><use href="#rxWB" x="28"/><use href="#rxWB" x="42"/><use href="#rxWB" x="56"/><use href="#rxWB" x="70"/><use href="#rxWB" x="84"/><use href="#rxWB" x="98"/><use href="#rxWB" x="112"/><use href="#rxWB" x="126"/><use href="#rxWB" x="140"/><use href="#rxWB" x="154"/><use href="#rxWB" x="168"/><use href="#rxWB" x="182"/><use href="#rxWB" x="196"/><use href="#rxWB" x="210"/><use href="#rxWB" x="224"/><use href="#rxWB" x="238"/><use href="#rxWB" x="252"/><use href="#rxWB" x="266"/><use href="#rxWB" x="280"/><use href="#rxWB" x="294"/><use href="#rxWB" x="308"/><use href="#rxWB" x="322"/><use href="#rxWB" x="336"/><use href="#rxWB" x="350"/><use href="#rxWB" x="364"/><use href="#rxWB" x="378"/><use href="#rxWB" x="392"/></svg><div class="es-rx-convert-action-title">${conv.type.replace(' 에너지','')} 전환 행동<span>+</span></div>${convActionsHtml}<svg class="es-rx-feather" viewBox="0 0 420 7" fill="none" aria-hidden="true"><defs><path id="rxWA" fill="#121212" d="M0.212305 0C0.344759 0.0637227 0.385701 0.15347 0.489699 0.234411C1.35107 0.904807 2.31447 1.63521 3.36595 1.97008C3.38334 1.86576 3.40027 1.78771 3.47186 1.70579C3.54054 1.75049 3.61491 1.84893 3.67772 1.90573C3.77667 1.99521 3.90336 2.07179 4.01804 2.13831C4.66295 2.51233 5.49001 2.68473 6.00802 3.24757C6.38199 3.65386 6.4623 4.12859 6.4641 4.65893C6.46459 4.80118 6.48105 5.0616 6.51459 5.19406C6.59199 5.49955 6.84617 5.79422 6.83497 6.12481C6.83145 6.22901 6.79865 6.31385 6.71791 6.38456C6.57485 6.50985 6.37401 6.58669 6.19476 6.64214C6.15844 6.65331 6.0217 6.66739 5.97771 6.6721C5.81491 6.68779 5.65188 6.70138 5.48871 6.71273C5.27188 6.72984 5.04836 6.75986 4.82913 6.75155C4.80713 6.75068 4.80326 6.74963 4.7896 6.73425C4.76603 6.66298 4.81139 6.48833 4.83228 6.41601C4.54983 6.53832 4.35167 6.54991 4.04808 6.51531C3.75567 6.482 3.67274 6.52318 3.49257 6.26064C3.6348 6.14422 3.81935 6.11643 3.96463 6.03283C3.69009 6.05912 3.26088 6.08102 3.00191 5.98761C2.78518 5.90946 2.60706 5.82319 2.50578 5.60381C2.61718 5.514 2.7727 5.53366 2.9079 5.52889C3.14407 5.52045 3.39167 5.4962 3.6094 5.39672C3.42958 5.40177 3.24964 5.40116 3.06986 5.39487C2.81085 5.38689 2.48991 5.37711 2.23843 5.31823C2.13378 5.28052 2.01365 5.22872 1.91907 5.17233C1.72744 5.05808 1.49981 4.9168 1.50778 4.66704C1.63122 4.65051 1.72899 4.68669 1.85476 4.69495C2.05364 4.708 2.25451 4.71891 2.45286 4.73805L2.91464 4.7783C3.00896 4.78589 3.13923 4.79902 3.23205 4.79363C3.16713 4.76985 3.10173 4.74606 3.0363 4.72352C2.84563 4.65783 2.65582 4.64248 2.45763 4.61699C2.31981 4.59918 2.18289 4.57513 2.04725 4.5449C1.70328 4.47338 1.37267 4.34811 1.06752 4.17367C0.915022 4.08718 0.7621 3.91434 0.717433 3.74267C0.70723 3.70345 0.685407 3.62525 0.708078 3.58929C0.708375 3.58612 0.72617 3.57243 0.727655 3.57257C0.809725 3.58082 0.895 3.62018 0.972974 3.64871C1.27845 3.76049 1.58779 3.85467 1.90837 3.91159C1.99643 3.92723 2.08681 3.95781 2.17616 3.9699C2.22598 3.97663 2.27796 3.97685 2.32814 3.98071C2.53379 3.98991 2.76411 4.03591 2.96798 4.00349C2.8359 3.96737 2.68826 3.97537 2.56841 3.9431C2.31512 3.8749 2.05137 3.82893 1.8007 3.75711C1.376 3.63544 0.906923 3.44065 0.583339 3.13346C0.392872 2.95265 0.262942 2.64644 0.263611 2.38396C0.517802 2.41851 0.655058 2.56683 0.870423 2.67652C1.22564 2.85745 1.60058 3.03449 1.98582 3.14141C2.08996 3.17031 2.20452 3.18189 2.31045 3.20905C2.50588 3.25917 2.69995 3.31372 2.89787 3.35266C2.70487 3.24079 2.45409 3.20831 2.25017 3.12471C2.07893 3.05451 1.89464 2.98746 1.72663 2.9127C1.25328 2.70208 0.788075 2.43154 0.42543 2.05611C0.358123 1.98644 0.284407 1.9065 0.229889 1.82549C0.120452 1.63076 -0.0312484 1.2994 0.0056534 1.06882C0.00971545 1.04343 0.0284577 1.00869 0.0497982 0.998258C0.149762 0.949396 0.268239 1.10496 0.333776 1.16561C0.369329 1.1985 0.40065 1.22721 0.435392 1.258C0.847487 1.62526 1.31122 1.92978 1.8117 2.1618C1.93394 2.21822 2.05586 2.25887 2.17779 2.31177C2.42593 2.41945 2.67289 2.53006 2.93598 2.59706C2.82038 2.52159 2.68495 2.47053 2.5581 2.41755C2.45412 2.37382 2.35119 2.32762 2.24939 2.27899C2.11406 2.21437 2.00148 2.14485 1.87293 2.07925C1.45791 1.86746 1.07555 1.63012 0.726127 1.31923C0.636526 1.23952 0.477002 1.08997 0.418377 0.979273C0.280403 0.718769 0.151334 0.428885 0.178732 0.125882C0.180594 0.105291 0.205443 0.0235068 0.212305 0Z"/><path id="rxWB" fill="#121212" d="M13.6802 0.125C13.8229 0.153861 13.7227 0.541416 13.711 0.645361C13.6897 0.83661 13.5383 1.00893 13.4137 1.14899C12.9406 1.68043 12.2942 2.01949 11.6603 2.32201C11.4373 2.4296 11.1519 2.49155 10.9546 2.62158C11.7995 2.38472 12.6024 1.96696 13.3211 1.46894C13.5012 1.34416 13.6617 1.19745 13.8278 1.05554C13.8612 1.02709 13.9401 0.957652 13.9836 0.969595C14.0575 1.07574 13.8589 1.58357 13.8043 1.70935C13.7656 1.7987 13.6659 1.93536 13.6004 2.01406C13.1259 2.58452 12.3926 2.8938 11.7068 3.13197C11.4505 3.21981 11.2029 3.26847 10.9471 3.37436C11.1609 3.35069 11.3315 3.30212 11.5381 3.25754C11.8087 3.19917 12.0233 3.16182 12.2829 3.06338C12.5233 2.97221 12.7441 2.89135 12.9741 2.76984C13.1989 2.65111 13.4074 2.4761 13.6523 2.40861C13.7239 2.48435 13.6981 2.5792 13.6659 2.66903C13.5999 2.85302 13.4883 3.03861 13.3565 3.18324C13.2975 3.24782 13.1954 3.30821 13.1249 3.35977C12.7351 3.61678 12.2859 3.749 11.8345 3.8496C11.6045 3.90086 11.3809 3.96192 11.1462 3.99181C11.0425 4.005 10.9374 4.02549 10.843 4.07165C11.0142 4.04928 11.1656 4.05956 11.334 4.04807C11.8755 4.0111 12.4271 3.90651 12.9205 3.67561C12.9948 3.64087 13.132 3.55718 13.2061 3.59787C13.2801 3.63855 13.196 3.84728 13.1555 3.89796C12.9433 4.21285 12.6234 4.36915 12.2641 4.44891C12.0525 4.50963 11.8677 4.56055 11.6504 4.6025C11.2985 4.67047 10.942 4.72174 10.594 4.8065C10.704 4.81199 10.8567 4.80476 10.9696 4.80282C11.2934 4.79599 11.6182 4.78353 11.9383 4.73054C12.0521 4.71323 12.1645 4.68438 12.2798 4.67922C12.3171 4.67754 12.3814 4.68117 12.3909 4.72723C12.4011 4.77705 12.3705 4.83396 12.3449 4.87549C12.2666 5.00316 12.1443 5.09877 12.0173 5.17515C11.6364 5.41081 11.1431 5.38291 10.7108 5.38003C10.5613 5.37903 10.3614 5.36584 10.2174 5.40066C10.3551 5.50013 10.635 5.53315 10.8013 5.55802C10.9408 5.57889 11.2219 5.52624 11.3377 5.58759C11.3719 5.6374 11.297 5.75282 11.2568 5.78831C10.9019 6.10148 10.398 6.05328 9.96056 6.04303C10.1302 6.14734 10.3045 6.06519 10.3351 6.29831C10.2601 6.40675 10.185 6.4723 10.0451 6.49193C9.8059 6.52545 9.51938 6.54853 9.28052 6.49909C9.21775 6.48613 9.13875 6.43607 9.08724 6.40108C9.08167 6.51853 9.07925 6.63605 9.07987 6.75363C9.03115 6.75573 8.98737 6.75351 8.93853 6.75011C8.6073 6.7269 8.27948 6.6745 7.9485 6.64617C7.87761 6.64012 7.76605 6.60636 7.69491 6.58723C7.46584 6.52551 7.07661 6.45187 7.04503 6.16339C7.00436 5.79071 7.28407 5.53889 7.36685 5.2038C7.47123 4.76926 7.36282 4.29509 7.51203 3.86916C7.62886 3.54757 7.8479 3.26751 8.11152 3.05366C8.44819 2.78056 8.82678 2.63466 9.2209 2.46986C9.56111 2.32763 9.90793 2.1588 10.212 1.94972C10.2697 1.91009 10.417 1.7015 10.5053 1.76631C10.5347 1.79206 10.5244 1.97348 10.5223 2.01379C10.7746 1.95334 10.9355 1.86656 11.1682 1.75572C11.8174 1.45118 12.4324 1.07892 13.0029 0.645175C13.1841 0.509086 13.4827 0.210929 13.6802 0.125Z"/></defs><use href="#rxWA" x="0"/><use href="#rxWA" x="14"/><use href="#rxWA" x="28"/><use href="#rxWA" x="42"/><use href="#rxWA" x="56"/><use href="#rxWA" x="70"/><use href="#rxWA" x="84"/><use href="#rxWA" x="98"/><use href="#rxWA" x="112"/><use href="#rxWA" x="126"/><use href="#rxWA" x="140"/><use href="#rxWA" x="154"/><use href="#rxWA" x="168"/><use href="#rxWA" x="182"/><use href="#rxWA" x="196"/><use href="#rxWA" x="210"/><use href="#rxWA" x="224"/><use href="#rxWA" x="238"/><use href="#rxWA" x="252"/><use href="#rxWA" x="266"/><use href="#rxWA" x="280"/><use href="#rxWA" x="294"/><use href="#rxWA" x="308"/><use href="#rxWA" x="322"/><use href="#rxWA" x="336"/><use href="#rxWA" x="350"/><use href="#rxWA" x="364"/><use href="#rxWA" x="378"/><use href="#rxWA" x="392"/><use href="#rxWB" x="0"/><use href="#rxWB" x="14"/><use href="#rxWB" x="28"/><use href="#rxWB" x="42"/><use href="#rxWB" x="56"/><use href="#rxWB" x="70"/><use href="#rxWB" x="84"/><use href="#rxWB" x="98"/><use href="#rxWB" x="112"/><use href="#rxWB" x="126"/><use href="#rxWB" x="140"/><use href="#rxWB" x="154"/><use href="#rxWB" x="168"/><use href="#rxWB" x="182"/><use href="#rxWB" x="196"/><use href="#rxWB" x="210"/><use href="#rxWB" x="224"/><use href="#rxWB" x="238"/><use href="#rxWB" x="252"/><use href="#rxWB" x="266"/><use href="#rxWB" x="280"/><use href="#rxWB" x="294"/><use href="#rxWB" x="308"/><use href="#rxWB" x="322"/><use href="#rxWB" x="336"/><use href="#rxWB" x="350"/><use href="#rxWB" x="364"/><use href="#rxWB" x="378"/><use href="#rxWB" x="392"/></svg><div class="es-rx-case-title">발산 이후에 실제 관측 사례</div>${convCasesHtml}</div></div></div></div></div></div></div>${esStatsHtml()}<div class="es-rx-buttons"><button class="es-again" onclick="esRestart()">처음부터 다시</button><button class="es-home" onclick="exitExamSlides()">홈으로</button></div>`;
  esFitRxCard();
  esRxPlayEntrance();
}

/* 처방전 앞면의 궁금증 장치: 뒷면 결과(전환 가능 유형)의 이름을 검은 줄로 가려 보여 줌.
   누르면 카드 전체 클릭으로 뒤집히며 뒷면에서 이름이 드러남 */
function esRxTeaser(type){
  const name = String(type).replace(' 에너지', '');
  return `<div class="es-rx-teaser" role="button" aria-label="전환 가능 유형 열람하기 (카드 뒤집기)">`
    + `<span class="es-rx-teaser-label">전환 가능 유형</span>`
    + `<span class="es-rx-teaser-val">[ <i class="es-rx-redact" style="width:${name.length * 1.05}em"></i> 에너지 ]</span>`
    + `<span class="es-rx-teaser-go">열람하기 →</span></div>`;
}

/* 카드가 등장한 뒤 한 번만 살짝 돌았다 돌아와 '뒤집을 수 있는 카드'임을 알려 줌 */
const ES_RX_NUDGE = { delay: 700, duration: 1100, angle: -28 };
let esRxNudgeAnim = null;
function esRxNudge(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const flip = document.getElementById('esRxFlip');
  const inner = flip && flip.querySelector('.es-rx-flip-inner');
  if(!inner || !inner.animate) return;
  esRxNudgeAnim = inner.animate([
    { transform: 'rotateY(0deg)' },
    { transform: `rotateY(${ES_RX_NUDGE.angle}deg)`, offset: .45 },
    { transform: `rotateY(${-ES_RX_NUDGE.angle * .15}deg)`, offset: .75 },
    { transform: 'rotateY(0deg)' }
  ], { duration: ES_RX_NUDGE.duration, delay: ES_RX_NUDGE.delay, easing: 'cubic-bezier(.22,1,.36,1)' });
}

function esRxPlayEntrance(){
  const slide = document.getElementById('esRxSlide');
  if(!slide) return;
  const title = slide.querySelector('.es-rx-result-title');
  const face = slide.querySelector('.es-rx-face');
  const card = document.getElementById('esRxFlip');
  // 결과(처방전 카드)를 먼저 보여주고, 제목·아이콘이 뒤따라 정착
  esReveal([
    card  && [card, 0, 'translateY(16px) scale(.97)'],
    title && [title, ES_MOTION.revealStep, 'translateY(10px)'],
    face  && [face, ES_MOTION.revealStep * 1.5, 'translateY(10px)']
  ].filter(Boolean));
  esRxNudge();
}

function esFitRxFace(face){
  const body = face.querySelector('.es-rx-body');
  const svg = face.querySelector('.es-rx-bg');
  const path = svg && svg.querySelector('path');
  if(!body || !svg || !path) return 902;
  const h = Math.max(902, Math.ceil(body.offsetHeight));
  const delta = h - 902;
  svg.setAttribute('viewBox', `0 0 480 ${h}`);
  path.setAttribute('d', `M480 221.947C480 226.053 476.672 229.381 472.566 229.381C468.461 229.381 465.133 232.709 465.133 236.814V243.187C465.133 247.292 468.461 250.62 472.566 250.62C476.672 250.62 480 253.948 480 258.054V${890.974+delta}C480 ${896.839+delta} 475.246 ${901.594+delta} 469.381 ${901.594+delta}H10.6195C4.75452 ${901.594+delta} 0 ${896.839+delta} 0 ${890.974+delta}V257.523C0 253.711 3.0905 250.62 6.90283 250.62C10.7152 250.62 13.8057 247.53 13.8057 243.717V236.284C13.8057 232.471 10.7152 229.381 6.90283 229.381C3.0905 229.381 0 226.29 0 222.478V10.6195C0 4.7545 4.7545 0 10.6195 0H469.381C475.245 0 480 4.7545 480 10.6195V221.947Z`);
  return h;
}
function esFitRxCard(){
  const flip = document.getElementById('esRxFlip');
  if(!flip) return;
  const front = flip.querySelector('.es-rx-card-face-front');
  const back = flip.querySelector('.es-rx-card-face-back');
  const hFront = front ? esFitRxFace(front) : 902;
  const hBack = back ? esFitRxFace(back) : 902;
  const inner = flip.querySelector('.es-rx-flip-inner');
  if(inner) inner.style.height = (flip.classList.contains('es-flipped') ? hBack : hFront) + 'px';
}
function esFlipRx(){
  const flip = document.getElementById('esRxFlip');
  if(!flip) return;
  if(esRxNudgeAnim){ esRxNudgeAnim.cancel(); esRxNudgeAnim = null; }   // 살짝 돌기 중에 누르면 바로 뒤집기
  flip.classList.toggle('es-flipped');
  esFitRxCard();
  const flipped = flip.classList.contains('es-flipped');
  const slide = flip.closest('.es-slide');
  if(slide){
    slide.classList.toggle('es-bg-blue', !flipped);
    slide.classList.toggle('es-bg-black', flipped);
  }
  document.getElementById('examSlides').classList.toggle('es-cur-blue', !flipped);
  esSyncBar();
  if(flip.matches(':hover')) esRxHoverAdjust(true);
}
function esRxHoverAdjust(enter){
  const flip = document.getElementById('esRxFlip');
  const slide = document.getElementById('esRxSlide');
  if(!flip || !slide) return;
  const title = slide.querySelector('.es-rx-result-title');
  const face = slide.querySelector('.es-rx-face');
  const stats = slide.querySelector('.es-stats');
  const buttons = slide.querySelector('.es-rx-buttons');
  const offset = enter ? Math.round(flip.offsetHeight*0.05)+16 : 0;
  document.getElementById('examSlides').classList.toggle('es-rx-hover', enter);   // 커진 카드와 진행 점이 겹치지 않게
  if(title) title.style.transform = enter ? `translateY(-${offset}px)` : '';
  if(face) face.style.transform = enter ? `translateY(-${offset}px)` : '';
  if(stats) stats.style.transform = enter ? `translateY(${offset}px)` : '';
  if(buttons) buttons.style.transform = enter ? `translateY(${offset}px)` : '';
}
addEventListener('resize', () => { if(esSlides[esCur] && esSlides[esCur].kind === 'rx') esFitRxCard(); });

function esGo(n){
  if(esLock || n < 0 || n >= esSlides.length) return;
  esLock = true; esCur = n;
  document.querySelectorAll('#esDeck .es-slide').forEach((el,i) => el.classList.toggle('es-on', i===n));
  document.getElementById('esBar').style.width = (esSlides.length>1 ? (n/(esSlides.length-1)*100) : 0) + '%';
  document.querySelectorAll('#esDots i[data-d]').forEach(d => {
    const i = +d.dataset.d;
    d.classList.toggle('es-done', i<n);
    d.classList.toggle('es-cur', i===n);
  });
  document.getElementById('esBack').style.display = 'block';
  document.getElementById('examSlides').classList.toggle('es-cur-blue', document.querySelectorAll('#esDeck .es-slide')[n].classList.contains('es-bg-blue'));
  esSyncBar();
  document.getElementById('examSlides').classList.toggle('es-on-case', esSlides[n].kind === 'case');
  document.getElementById('examSlides').classList.toggle('es-on-rx', esSlides[n].kind === 'rx');
  document.getElementById('examSlides').classList.remove('es-rx-hover');
  const k = esSlides[n].kind;
  if(k === 'q') esLikertIntro(document.querySelectorAll('#esDeck .es-slide')[n]);
  if(k === 'case') esCaseReset(document.querySelectorAll('#esDeck .es-slide')[n]);
  if(k === 'stage') esRenderStage();
  if(k === 'type') esRenderType();
  if(k === 'sentence') esRenderSentence();
  if(k === 'rx') esRenderRxDelayed();
  setTimeout(() => { esLock = false; }, ES_MOTION.slide);
}
function esRenderRxDelayed(){
  const slide = document.getElementById('esRxSlide');
  if(slide) slide.innerHTML = '<div class="es-rx-loading"><div class="es-rx-loading-text">처방전 작성 중</div><div class="es-rx-loading-dots"><span></span><span></span><span></span></div></div>';
  setTimeout(esRenderRx, 1100);
}

/* 검사 화면에서도 메인 상단바를 그대로 씀: 현재 슬라이드가 밝은 배경(파랑·흰색)이면 검정 글자·로고 */
function esSyncBar(){
  const slide = document.querySelectorAll('#esDeck .es-slide')[esCur];
  const light = !!slide && (slide.classList.contains('es-bg-blue') || slide.classList.contains('es-bg-white'));
  document.body.classList.toggle('es-bar-dark', light);
}

function esHit(btn, fn){ if(btn) btn.classList.add('es-hit'); setTimeout(fn, ES_MOTION.pick); }
function esAnswer(i, v, btn){ ES.answers[i] = v; esLikertPick(btn, () => esGo(esCur+1)); }

/* ── 검사 질문 답변 상자 모션 (CodePen 'select' 효과를 옮김, 외부 라이브러리 없이 Web Animations) ──
   1) 질문이 나타나면 상자 5개가 조금 크게·투명한 상태에서 차례로 탄성 있게 제자리로
   2) 하나를 고르면 나머지는 사라지고, 고른 상자가 커졌다 → 가운데로 이동 → 원래 크기로 돌아오며 검정으로 채워진 뒤 다음 질문 */
const ES_LIKERT_FX = {
  introDelay: 120,    // 질문 화면 전환 뒤 시작 (ms)
  introDur: 1100,     // 상자 하나가 튀어나와 자리잡는 시간
  introStep: 100,     // 상자 사이 시작 간격
  fromScale: 1.2,     // 시작·선택 시 커지는 배율
  step: 250           // 선택 연출 한 단계 시간 (사라짐 → 커짐 → 가운데로 → 원래 크기·채움 → 다음)
};
const esLikertReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate;

function esLikertReset(slide){
  const box = slide && slide.querySelector('.es-likert');
  if(!box) return null;
  box.style.pointerEvents = '';
  box.querySelectorAll('.es-opt').forEach(b => { b.getAnimations().forEach(a => a.cancel()); b.classList.remove('es-hit'); });
  return box;
}
function esLikertIntro(slide){
  const box = esLikertReset(slide);
  if(!box) return;
  // 이전 질문을 클릭한 자리에 마우스가 그대로 있으면 새 상자가 '이미 고른 것처럼' 반전되지 않게, 마우스를 움직일 때까지 호버 끔
  box.classList.add('es-likert-still');
  box.addEventListener('mousemove', () => box.classList.remove('es-likert-still'), { once: true });
  if(esLikertReduced()) return;
  const F = ES_LIKERT_FX, s = F.fromScale;
  box.querySelectorAll('.es-opt').forEach((b, i) => b.animate([
    { transform: `scale(${s})`, opacity: 0 },
    { transform: 'scale(.97)', opacity: 1, offset: .3 },          // 탄성: 살짝 지나쳤다가
    { transform: 'scale(1.015)', offset: .5 },
    { transform: 'scale(.995)', offset: .7 },
    { transform: 'scale(1)' }
  ], { duration: F.introDur, delay: F.introDelay + F.introStep * i, easing: 'ease-out', fill: 'backwards' }));
}
function esLikertPick(btn, next){
  const box = btn && btn.closest('.es-likert');
  if(!box || esLikertReduced()){ esHit(btn, next); return; }
  if(box.style.pointerEvents === 'none') return;   // 연출 중 중복 선택 막기
  box.style.pointerEvents = 'none';
  const F = ES_LIKERT_FX, t = F.step, s = F.fromScale;
  btn.getAnimations().forEach(a => a.finish());
  box.querySelectorAll('.es-opt').forEach(b => {
    if(b !== btn) b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: t, easing: 'ease', fill: 'forwards' });
  });
  const br = btn.getBoundingClientRect(), r = box.getBoundingClientRect();
  const dx = (r.left + r.width / 2) - (br.left + br.width / 2);   // 줄 가운데까지 거리
  btn.animate([
    { transform: 'translateX(0) scale(1)', offset: 0 },
    { transform: 'translateX(0) scale(1)', offset: .25 },            // 나머지가 사라지는 동안 대기
    { transform: `translateX(0) scale(${s})`, offset: .5 },          // 커짐
    { transform: `translateX(${dx}px) scale(${s})`, offset: .75 },   // 가운데로
    { transform: `translateX(${dx}px) scale(1)`, offset: 1 }         // 원래 크기
  ], { duration: t * 4, easing: 'ease-in-out', fill: 'forwards' });
  setTimeout(() => btn.classList.add('es-hit'), t * 3);              // 원래 크기로 돌아오며 채움
  setTimeout(next, t * 4 + 120);
}
/* 트리거 상황 대사: 따옴표로 시작하면 “ ” 로 감싸 보여 줌 */
function esQuote(sub){
  const t = String(sub).trim();
  return /^["“]/.test(t) ? `“ ${t.replace(/^["“]|["”]$/g, '')} ”` : t;
}
function esBackStep(){ if(esCur <= 0) exitExamSlides(); else esGo(esCur-1); }
function esCaseNext(i){ if(ES.picks[i]) esGo(esCur+1); }   // 고른 뒤에만 다음으로

/* 트리거 관찰 기록(1466×655)이 화면보다 크면 비율 그대로 축소 */
function esFitCase(){
  const s = Math.min(1, (innerWidth - 120) / 1466, (innerHeight - 150) / 655);
  document.getElementById('examSlides').style.setProperty('--es-case-scale', s.toFixed(3));
}
addEventListener('resize', esFitCase);

/* 트리거 관찰 기록 선택: 고른 쪽이 채워진 채 잠깐 멈춰 보여 주고(나머지는 흐리게) 다음으로 */
const ES_CASE_HOLD = 800;   // 선택을 보여 주는 시간 (ms)
function esPick(i, opt, btn){
  const wrap = btn && btn.closest('.es-cs-opts');
  if(wrap && wrap.style.pointerEvents === 'none') return;   // 보여 주는 동안 중복 선택 막기
  ES.picks[i] = opt; addStat(currentSet[i][opt].tag);
  if(!wrap){ esHit(btn, () => esGo(esCur+1)); return; }
  wrap.style.pointerEvents = 'none';
  wrap.querySelectorAll('.es-cs-opt').forEach(b => {
    b.classList.toggle('es-hit', b === btn);
    b.style.transition = 'opacity .25s ease, background-color 160ms ease, color 160ms ease';
    b.style.opacity = b === btn ? '' : '.3';
  });
  setTimeout(() => esGo(esCur+1), ES_CASE_HOLD);
}
/* 트리거 관찰 기록으로 (다시) 들어오면 흐리게·잠금 상태를 풀어 줌 (고른 표시는 유지) */
function esCaseReset(slide){
  const wrap = slide && slide.querySelector('.es-cs-opts');
  if(!wrap) return;
  wrap.style.pointerEvents = '';
  wrap.querySelectorAll('.es-cs-opt').forEach(b => { b.style.opacity = ''; b.style.transition = ''; });
}

function esOpen(){
  esSessionBumped = false;
  currentSet = triggerSessionCount % 2 === 0 ? TRIGGER_SET_A : TRIGGER_SET_B;
  ES.answers = Array(questions.length).fill(0);
  ES.picks = {}; ES.stage = null; ES.type = null; ES.kwKeyword = ''; ES.kwStage = '';
  esSlides = esBuildSlides();
  const deck = document.getElementById('esDeck');
  deck.innerHTML = esSlides.map((s,i) => `<section class="es-slide ${esBg(s.kind,s.i||0)}${s.kind==='rx'?' es-slide-rx':''}${s.kind==='case'?' es-slide-case':''}" data-i="${i}">${esHtml(s)}</section>`).join('');
  const dots = document.getElementById('esDots');
  dots.innerHTML = esSlides.map((s,i) => {
    const sep = (s.kind==='stage'||s.kind==='type') ? '<i class="es-sep"></i>' : '';
    return sep + `<i data-d="${i}"></i>`;
  }).join('');
  document.querySelectorAll('.es-opt.es-hit').forEach(b => b.classList.remove('es-hit'));
  esFitCase();
  esCur = -1;
  esGo(0);
}

function esRestart(){ esOpen(); }

function enterExamSlides(){
  document.body.classList.add('es-immersive');
  document.getElementById('examSlides').classList.add('es-visible');
  esOpen();
}

function exitExamSlides(){
  document.getElementById('examSlides').classList.remove('es-visible');
  document.body.classList.remove('es-bar-dark');
  setTimeout(() => {
    document.body.classList.remove('es-immersive');
  }, ES_MOTION.enter);
}

document.getElementById('esBack').addEventListener('click', () => {
  if(esCur <= 0) exitExamSlides(); else esGo(esCur-1);
});

addEventListener('keydown', e => {
  if(!document.body.classList.contains('es-immersive')) return;
  if(e.key === 'Escape'){ exitExamSlides(); return; }
  if(e.key === 'ArrowLeft'){ if(esCur <= 0) exitExamSlides(); else esGo(esCur-1); }
  if(e.key === 'ArrowRight' && esSlides[esCur] && esSlides[esCur].kind !== 'q' && esSlides[esCur].kind !== 'case'){ esGo(esCur+1); }
});

let esTx = 0, esTy = 0;
addEventListener('touchstart', e => {
  if(!document.body.classList.contains('es-immersive')) return;
  esTx = e.touches[0].clientX; esTy = e.touches[0].clientY;
}, {passive:true});
addEventListener('touchend', e => {
  if(!document.body.classList.contains('es-immersive')) return;
  const dx = e.changedTouches[0].clientX - esTx, dy = e.changedTouches[0].clientY - esTy;
  if(Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)){
    if(dx > 0){ if(esCur <= 0) exitExamSlides(); else esGo(esCur-1); }
    else if(esSlides[esCur] && esSlides[esCur].kind !== 'q' && esSlides[esCur].kind !== 'case'){ esGo(esCur+1); }
  }
});

/* 메인 "내 상태 확인하기" 버튼 → 검사 화면 열기 */
document.querySelectorAll('.dg-btn').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); enterExamSlides(); });
});

/* 검사 중 메인 상단바(분해소·로고·연구소 안내 등)를 누르면 검사를 닫고 원래 동작대로 이동 */
document.querySelectorAll('.topbar a').forEach(a => {
  a.addEventListener('click', () => {
    if(document.body.classList.contains('es-immersive')) exitExamSlides();
  });
});

/* ── 트리거 관찰 기록 배경 도트 + 마우스 픽셀 효과 (배경 도트에만 적용) ──
   검사 화면 전체를 덮는 캔버스에 작은 네모 도트 격자를 그림(투명도는 exam.css에서 15%).
   트리거 상황·처방전 결과 화면일 때만 보이고, 마우스 근처 도트만 밀려나거나 투명해졌다가 제자리로 돌아옴.
   움직임 값은 메인 픽셀 효과(PARTICLE_FX)와 같은 값을 씀. */
const ES_BG_DOTS = {
  gap: 10,        // 도트 간격 (px)
  shape: 'square', // 'square': 네모 도트 / 'x': × 모양 + 가로선으로 이어진 망점
  size: 4,        // 도트 크기 (px)
  stroke: 1.3,    // × 선 굵기 (px, 'x'일 때만)
  rowLine: 0,     // 줄마다 도트를 잇는 가로선 굵기 (px, 0이면 없음)
  brushScale: 1.5 // 마우스 픽셀 효과 반경 배율 (메인 효과 반경 × 1.5)
};
(function(){
  const host = document.getElementById('examSlides');
  if(!host) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'es-bgdots';
  canvas.setAttribute('aria-hidden', 'true');
  host.insertBefore(canvas, host.firstChild);
  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  const FX = (typeof PARTICLE_FX !== 'undefined') ? PARTICLE_FX
    : { radius: 50, pushMin: 4, pushMax: 12, dropRatio: .28, stillRatio: .3, restore: 650 };
  const canMove = matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = t => t * t * (3 - 2 * t);
  let W = 0, H = 0, DPR = 1, cols = 0, rows = 0, base = null;
  let ang, dist, kind, d, active = [], raf = null, prevT = 0, last = null;

  // 도트 하나 그리기 (cx, cy: 캔버스 픽셀 좌표의 가운데)
  function mark(g2, cx, cy){
    const rad = ES_BG_DOTS.size / 2 * DPR;
    if(ES_BG_DOTS.shape === 'x'){
      g2.beginPath();
      g2.moveTo(cx - rad, cy - rad); g2.lineTo(cx + rad, cy + rad);
      g2.moveTo(cx + rad, cy - rad); g2.lineTo(cx - rad, cy + rad);
      g2.stroke();
    } else {
      g2.fillRect(Math.round(cx - rad), Math.round(cy - rad), Math.round(rad * 2), Math.round(rad * 2));   // 네모 도트 (픽셀 경계에 맞춰 또렷하게)
    }
  }
  function markStyle(g2){
    g2.fillStyle = g2.strokeStyle = '#ffffff';
    g2.lineWidth = ES_BG_DOTS.stroke * DPR; g2.lineCap = 'butt';
  }

  function build(){
    W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    const g = ES_BG_DOTS.gap;
    cols = Math.ceil(W / g); rows = Math.ceil(H / g);
    const n = cols * rows;
    ang = new Float32Array(n); dist = new Float32Array(n); kind = new Uint8Array(n); d = new Float32Array(n);
    for(let i = 0; i < n; i++){
      ang[i] = Math.random() * Math.PI * 2;
      dist[i] = FX.pushMin + Math.random() * (FX.pushMax - FX.pushMin);
      const r = Math.random();
      kind[i] = r < FX.dropRatio ? 2 : r < FX.dropRatio + FX.stillRatio ? 1 : 0;   // 2 투명, 1 제자리, 0 밀림
    }
    // 움직이지 않는 도트 격자 한 장을 미리 그려 둠
    base = document.createElement('canvas'); base.width = canvas.width; base.height = canvas.height;
    const b = base.getContext('2d');
    markStyle(b);
    for(let r = 0; r < rows; r++) for(let c = 0; c < cols; c++) mark(b, (c + .5) * g * DPR, (r + .5) * g * DPR);
    // 줄마다 도트를 잇는 가로선
    if(ES_BG_DOTS.rowLine > 0){
      const lw = Math.max(1, Math.round(ES_BG_DOTS.rowLine * DPR));
      for(let r = 0; r < rows; r++) b.fillRect(0, Math.round((r + .5) * g * DPR - lw / 2), canvas.width, lw);
    }
    active = [];
    draw();
  }

  function draw(){
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(base, 0, 0);
    if(!active.length) return;
    const g = ES_BG_DOTS.gap, cell = g * DPR;
    // 흔들린 칸의 원래 도트를 지우고, 밀린 위치에 다시 찍음
    ctx.globalCompositeOperation = 'destination-out';
    for(const i of active) ctx.fillRect((i % cols) * cell, Math.floor(i / cols) * cell, cell, cell);
    ctx.globalCompositeOperation = 'source-over';
    markStyle(ctx);
    for(const i of active){
      const e = smooth(Math.min(1, d[i]));
      let ox = 0, oy = 0, a = 1;
      if(kind[i] === 0){ const r = dist[i] * e * DPR; ox = Math.cos(ang[i]) * r; oy = Math.sin(ang[i]) * r; }
      else if(kind[i] === 2){ a = 1 - e; }
      if(a <= .01) continue;
      ctx.globalAlpha = a;
      mark(ctx, ((i % cols) + .5) * cell + ox, (Math.floor(i / cols) + .5) * cell + oy);
    }
    ctx.globalAlpha = 1;
  }

  function stamp(x, y){
    const g = ES_BG_DOTS.gap, R = FX.radius * ES_BG_DOTS.brushScale;
    const c0 = Math.max(0, Math.floor((x - R) / g)), c1 = Math.min(cols - 1, Math.floor((x + R) / g));
    const r0 = Math.max(0, Math.floor((y - R) / g)), r1 = Math.min(rows - 1, Math.floor((y + R) / g));
    for(let r = r0; r <= r1; r++) for(let c = c0; c <= c1; c++){
      const dx = (c + .5) * g - x, dy = (r + .5) * g - y, q = (dx * dx + dy * dy) / (R * R);
      if(q > 1) continue;
      const f = (1 - q) * (.75 + Math.random() * .25) * 1.4;
      if(f <= .02) continue;
      const i = r * cols + c;
      if(d[i] <= 0) active.push(i);
      if(f > d[i]) d[i] = f;
    }
  }

  function loop(t){
    const dt = prevT ? t - prevT : 16; prevT = t;
    const step = dt / FX.restore;
    active = active.filter(i => (d[i] = Math.max(0, Math.min(d[i], 1) - step)) > 0);
    draw();
    if(active.length) raf = requestAnimationFrame(loop);
    else { raf = null; prevT = 0; }
  }

  if(canMove){
    host.addEventListener('mousemove', e => {
      if(!host.classList.contains('es-on-case') && !host.classList.contains('es-on-rx')){ last = null; return; }
      const x = e.clientX, y = e.clientY, R = FX.radius * ES_BG_DOTS.brushScale;
      if(last){
        const n = Math.ceil(Math.hypot(x - last.x, y - last.y) / (R / 3));
        for(let i = 1; i <= n; i++) stamp(last.x + (x - last.x) * i / n, last.y + (y - last.y) * i / n);
      } else stamp(x, y);
      last = { x, y };
      if(!raf) raf = requestAnimationFrame(loop);
    });
    host.addEventListener('mouseleave', () => { last = null; });
  }
  addEventListener('resize', build);
  build();
})();
