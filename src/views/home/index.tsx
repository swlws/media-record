import { NavLink } from "react-router-dom";
import styles from "./index.module.scss";

function Home() {
  return (
    <article className={styles.container}>
      <header>
        <h2>媒体工具</h2>
        <p>纯粹的WebApi调用，不涉及网络请求、不存储用户信息。</p>
      </header>

      <main>
        <NavLink to="/voice">录制声音</NavLink>
        <NavLink to="/photo">拍照</NavLink>
        <NavLink to="/video">录制视频</NavLink>
        <NavLink to="/screen">捕获屏幕</NavLink>
      </main>
    </article>
  );
}
export default Home;
