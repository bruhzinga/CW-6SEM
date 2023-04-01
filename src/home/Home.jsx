import "./style.css";
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {HeartFilled, HistoryOutlined, PlaySquareOutlined, TagOutlined} from '@ant-design/icons';
import {Button, Layout, Menu} from 'antd';
import {authActions} from "@/_store";
import {Favourites} from "@/Favourites/Favourites";
import {Main} from "@/Main/Main";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {ImageOutlined, Movie, PeopleOutlined, VideoFileOutlined, WatchLater} from "@mui/icons-material";

const { Header, Content, Sider } = Layout;

function getItem(label, path, icon, children) {
    return {
        path,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Main', '/', <PlaySquareOutlined style={{ fontSize: "24px" }} />),
    getItem('Watch later', '/watch-later', <WatchLater style={{ fontSize: "26px" }} />),
    getItem('Favourites', '/favourites', <HeartFilled style={{ fontSize: "24px" }} />),
    getItem('History', '/history', <HistoryOutlined style={{ fontSize: "24px" }} />)
];

const AdminItems = [
    getItem('Genres', '/admin-genre', <TagOutlined style={{ fontSize: "24px" }} />),
    getItem('Movies', '/admin-movie', <Movie style={{ fontSize: "24px" }} />),
    getItem('Videos', '/admin-video', <VideoFileOutlined style={{ fontSize: "24px" }} />),
    getItem('Images', '/admin-image', <ImageOutlined style={{ fontSize: "24px" }} />),
    getItem('People', '/admin-person', <PeopleOutlined style={{ fontSize: "24px" }} />),

];

export function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let location = useLocation()
    const logout = () => dispatch(authActions.logout());
    const [collapsed, setCollapsed] = useState(true);
    const { user: authUser } = useSelector(x => x.auth);

    const handleMenuSelect = ({ item }) => {
        navigate(item.props.path);

    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                style={{ position: 'fixed', height: '100vh' }}
            >
                <div style={{ height: 32, margin: 16, justifyContent: "center", textAlign: "center", color: "white" }} >
                    {authUser?.username}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={
                        authUser?.role.name === 'Admin' ? [...items, ...AdminItems] : items
                    }
                    defaultSelectedKeys={[location.pathname]}
                    onSelect={handleMenuSelect}
                />
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
                <Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>

                        </div>
                        <div>
                            <Button type="primary" onClick={logout}>Logout</Button>
                        </div>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default Home;