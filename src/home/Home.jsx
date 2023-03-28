import "./style.css";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeartFilled, HistoryOutlined, PlaySquareOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { authActions } from "../_store";
import { Favourites } from "../Favourites/Favourites";
import { Main } from "../Main/Main";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Main', 'Main', <PlaySquareOutlined style={{ fontSize: "24px" }} />),
    getItem('Watch later', 'Watch later', <TagOutlined style={{ fontSize: "24px" }} />),
    getItem('Favourites', 'Favourites', <HeartFilled style={{ fontSize: "24px" }} />),
    getItem('History', 'History', <HistoryOutlined style={{ fontSize: "24px" }} />)
];

function renderSwitch(param) {
    switch (param) {
        case 'Main':
            return <Main />
        case 'Favourites':
            return <Favourites />
        /*        case '3':
                    return <History/>*/
        default:
            return 'default';

    }
}

export function Home() {
    const dispatch = useDispatch();
    const logout = () => dispatch(authActions.logout());
    const [selectedMenuKey, setSelectedMenuKey] = useState("Main");
    const { user: authUser } = useSelector(x => x.auth);
    const [collapsed, setCollapsed] = useState(true);

    const handleMenuSelect = ({ key }) => {
        setSelectedMenuKey(key);
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
                    items={items}
                    defaultSelectedKeys={['Main']}
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
                    {selectedMenuKey && renderSwitch(selectedMenuKey)}
                </Content>
            </Layout>
        </Layout>
    );
}
