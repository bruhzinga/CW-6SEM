import { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {authActions} from "../_store";

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
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

export function Home() {
    const dispatch = useDispatch();
    const logout = () => dispatch(authActions.logout());
    const [selectedMenuKey, setSelectedMenuKey] = useState(null);
    const { user: authUser } = useSelector(x => x.auth);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleMenuSelect = ({ key }) => {
        setSelectedMenuKey(key);
    };
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu
                    theme="dark"
                    mode="inline"
                    items={items}
                    defaultSelectedKeys={['1']}
                    onSelect={handleMenuSelect}
                />
            </Sider>
            <Layout className="site-layout">
                <Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>

                        </div>
                        <div>
                            <Button type="primary" onClick={logout}>Logout</Button>
                        </div>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <h1>Hi {authUser?.username}!</h1>
                    {selectedMenuKey && <p>Selected menu: {selectedMenuKey}</p>}
                </Content>
            </Layout>
        </Layout>
    );
}
