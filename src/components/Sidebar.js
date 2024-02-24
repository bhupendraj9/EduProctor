import { MoreVertical, ChevronLast, ChevronFirst, LayoutDashboard, Book, GraduationCap, BookCopy, PlusSquare, User, Building2, Notebook, List, NotebookPenIcon } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";


const SidebarContext = createContext();

export default function Sidebar({ decodedtoken }) {
  const [expanded, setExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
 const [sidebarItems,setSidebarItems] = useState([])
  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  const setSidebarItemsByRole = () => {
    switch (decodedtoken.role) {
      case 'admin':
        setSidebarItems([
          // { icon: <User />, text: "Profile", active: true, alert: false, to: '/dashboard' },
          { icon: <Notebook />, text: "Add questions", active: false, alert: false, to: '/addquestion' },
          { icon: <List />, text: "view questions", active: false, alert: false, to: '/questions' }

          // { icon: <PlusSquare />, text: "Create Course", active: false, alert: false, to: '/create-course' },

        ]);
        break;
      case 'student':
        setSidebarItems([
       
          // { icon: <User />, text: "Profile", active: true, alert: false, to: '/dashboard' },
          
          { icon: <Book />, text: "tests", active: false, alert: false, to: '/student/tests' },
          
        ]);
        break;
      case 'faculty':
        setSidebarItems([
          // { icon: <User />, text: "Profile", active: true, alert: false, to: '/dashboard' },
          { icon: <Book />, text: "Create test", active: false, alert: false, to: '/addTest' },
          { icon: <NotebookPenIcon />, text: "my test", active: false, alert: false, to: '/mytests' }
        ]);
        break;
      default:
        setSidebarItems([]); // Default to empty array if role not recognized
    }
  };

  useEffect(() => {
    setSidebarItemsByRole();
  }, [decodedtoken.role]);

  return (
    <aside className="h-screen  sticky top-0">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex bg-gray-50 justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
        
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-1 bg-gray-50 ">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                <SidebarItem
                  icon={item.icon}
                  text={item.text}
                  active={index === activeIndex}
                  alert={item.alert}
                  to={item.to} 
                  onClick={() => {
                    handleItemClick(index); 
                    navigate(item.to); 
                  }}
                />
              </div>
            ))}
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3 ">
          <img
            src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(decodedtoken.name)}`}
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{decodedtoken.name}</h4>
              <span className="text-xs text-gray-600">{decodedtoken.id}</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert, to, onClick }) {
  const { expanded } = useContext(SidebarContext)

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-blue-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
      onClick={onClick} 
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}
