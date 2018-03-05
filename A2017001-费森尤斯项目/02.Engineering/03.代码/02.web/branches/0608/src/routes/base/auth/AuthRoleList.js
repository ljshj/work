import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';

const MenuItemGroup = Menu.ItemGroup;
class RoleList extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'auth/loadRoles',
    });
  }

  handleClick({ item, key }) {
    this.props.dispatch({
      type: 'auth/setState',
      payload: { roleId: key },
    });
  }

  render() {
    const { roles } = this.props.auth;
    const { wsHeight } = this.props.base;
    return (
      <Menu mode="inline" style={{ width: '200px', minHeight: `${wsHeight}px` }} onClick={this.handleClick} >
        <MenuItemGroup key="role">
          {
            roles.map((role) => {
              return <Menu.Item key={role.id}>{role.name}</Menu.Item>;
            })
          }
        </MenuItemGroup>
      </Menu>
    );
  }
}
export default connect(
  ({ auth, base }) => ({ auth, base }),
)(RoleList);

