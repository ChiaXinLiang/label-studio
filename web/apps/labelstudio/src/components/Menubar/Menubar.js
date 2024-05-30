import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StaticContent } from '../../app/StaticContent/StaticContent';
import { IconBook, IconModel, IconPin, LsDoor, LsSettings, Userpic } from '../../assets/icons';
import { useConfig } from '../../providers/ConfigProvider';
import { useContextComponent, useFixedLocation } from '../../providers/RoutesProvider';
import { cn } from '../../utils/bem';
import { absoluteURL, isDefined } from '../../utils/helpers';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Dropdown } from "../Dropdown/Dropdown";
import { VersionNotifier, VersionProvider } from '../VersionNotifier/VersionNotifier';
import './Menubar.styl';
import './MenuContent.styl';
import './MenuSidebar.styl';
import { ModelsPage } from '../../pages/Organization/Models/ModelsPage';
import { FF_DIA_835, isFF } from '../../utils/feature-flags';

export const MenubarContext = createContext();

const LeftContextMenu = ({ className }) => (
  <StaticContent
    id="context-menu-left"
    className={className}
  >{(template) => <Breadcrumbs fromTemplate={template} />}</StaticContent>
);

const RightContextMenu = ({ className, ...props }) => {
  const { ContextComponent, contextProps } = useContextComponent();

  return ContextComponent ? (
    <div className={className}>
      <ContextComponent {...props} {...(contextProps ?? {})}/>
    </div>
  ) : (
    <StaticContent
      id="context-menu-right"
      className={className}
    />
  );
};

export const Menubar = ({
  enabled,
  defaultOpened,
  defaultPinned,
  children,
  onSidebarToggle,
  onSidebarPin,
}) => {
  const menuDropdownRef = useRef();
  const useMenuRef = useRef();
  const location = useFixedLocation();

  const config = useConfig();
  const [sidebarOpened, setSidebarOpened] = useState(defaultOpened ?? false);
  const [sidebarPinned, setSidebarPinned] = useState(defaultPinned ?? false);
  const [PageContext, setPageContext] = useState({
    Component: null,
    props: {},
  });

  const menubarClass = cn('menu-header');
  const menubarContext = menubarClass.elem('context');
  const sidebarClass = cn('sidebar');
  const contentClass = cn('content-wrapper');
  const contextItem = menubarClass.elem('context-item');
  const showNewsletterDot = !isDefined(config.user.allow_newsletters);

  const sidebarPin = useCallback((e) => {
    e.preventDefault();

    const newState = !sidebarPinned;

    setSidebarPinned(newState);
    onSidebarPin?.(newState);
  }, [sidebarPinned]);

  const sidebarToggle = useCallback((visible) => {
    const newState = visible;

    setSidebarOpened(newState);
    onSidebarToggle?.(newState);
  }, [sidebarOpened]);

  const providerValue = useMemo(() => ({
    PageContext,

    setContext(ctx){
      setTimeout(() => {
        setPageContext({
          ...PageContext,
          Component: ctx,
        });
      });
    },

    setProps(props) {
      setTimeout(() => {
        setPageContext({
          ...PageContext,
          props,
        });
      });
    },

    contextIsSet(ctx) {
      return PageContext.Component === ctx;
    },
  }), [PageContext]);

  useEffect(() => {
    if (!sidebarPinned) {
      menuDropdownRef?.current?.close();
    }
    useMenuRef?.current?.close();
  }, [location]);

  return (
    <div className={contentClass}>
      <VersionProvider>
        <div className={contentClass.elem('body')}>
          <MenubarContext.Provider value={providerValue}>
            <div className={contentClass.elem('content').mod({ withSidebar: sidebarPinned && sidebarOpened })}>
              {children}
            </div>
          </MenubarContext.Provider>
        </div>
      </VersionProvider>
    </div>
  );
};