import "./css/Lobby.css";
import CountUp from "react-countup";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Slider from "react-slick";
import moment from "moment";

import the_sound from "./sounds/casino_sound.mp3";
import the_sound_winner from "./sounds/tada-sound.mp3";
import the_spinning_sound from "./sounds/spinning_sound.mp3";

import img_circles_only from "./images/CirclesOnly.gif";
import img_wheel_only from "./images/SmallPNG.png";
import img_wheel_only_lights from "./images/Small.gif";
import lightsOnly from "./images/Chicken.gif";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import default_image from "./images/bingo.png";


let intervalRunning = null;
let intervalRunningCurrentGame = null;
let locToken;
let loggedInUser = 0;
let second_time_error = false;
let previous_bonus = false;

let currentUser;
let userLoggedInFlag = 0;
let semaphoreLogin = 0;

let My_website;

export const getCurrentToken = () => {
  return sessionStorage.getItem("token_Lobby_Fruit_Rush");
};

export const getUserLoggedInFlag = () => {
  return userLoggedInFlag;
};

const languages_queue = [
  "./en.png",
  "./es.png",
  "./tr.png",
  "./pt.png",
  "./fr.png",
  "./it.png",
  "./ru.png",
  "./he.png",
];

const languages_queue_names = ["en", "es", "tr", "pt", "fr", "it", "ru", "he"];

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../../images/menu", false, /\.(png|jpe?g|svg)$/)
);



const imagesLanguages = importAllLanguages(
  require.context("../../images/languages", false, /\.(png|jpe?g|svg)$/)
);

function importAllLanguages(r) {
  return languages_queue.map(r);
}

const BalanceText = [
  "Balance:",
  "Saldo:",
  "Bakiye:",
  "Saldo:",
  "Solde:",
  "Equilibrio:",
  "баланс:",
  "איזון:",
];

const BonusText = [
  "Bonus:",
  "Prima:",
  "Bonus:",
  "Bônus:",
  "Bonus:",
  "Bonuse:",
  "бонус:",
  "מַעֲנָק:",
];

const ExitText = [
  "Exit",
  "salida",
  "çıkış",
  "saída",
  "sortie",
  "Uscita",
  "Выход",
  "יְצִיאָה",
];

const MenuText = [
  "Menu",
  "Menu",
  "Menü",
  "Menu",
  "Menu",
  "Menu",
  "меню",
  "תַפרִיט",
];

const InfoText = [
  "INFO",
  "INFO",
  "BİLGİ",
  "INFO",
  "INFO",
  "INFO",
  "ИНФО",
  "INFO",
];
const FavoritesText = [
  "Favorites",
  "Favoritos",
  "Favoriler",
  "Favoritos",
  "Favoris",
  "Preferiti",
  "Избранное",
  "מועדפים",
];

const FindText = [
  "Find",
  "Buscar",
  "Bul",
  "Encontrar",
  "Trouver",
  "Trova",
  "Найти",
  "למצוא",
];
const YesText = ["Yes", "Sí", "Evet", "Sim", "Oui", "Sì", "Да", "כן"];
const NoText = ["No", "No", "Hayır", "Não", "Non", "No", "Нет", "לא"];
const AreYouSureText = [
  "Are you sure?",
  "¿Estás seguro?",
  "Emin misin?",
  "Você tem certeza?",
  "Es-tu sûr(e) ?",
  "Sei sicuro?",
  "Вы уверены?",
  "האם אתה בטוח?",
];

const TopText = [
  "Top",
  "Superior",
  "Üst",
  "Topo",
  "Haut",
  "Superiore",
  "Верх",
  "ראשי",
];
const NewText = [
  "New",
  "Nuevo",
  "Yeni",
  "Novo",
  "Nouveau",
  "Nuovo",
  "Новый",
  "חדש",
];
const CashbackText = [
  "Cashback bonus",
  "Bono de devolución de efectivo",
  "Nakit iade bonusu",
  "Bônus de cashback",
  "Bonus de remboursement",
  "Bonus di rimborso",
  "Бонус за возврат денег",
  "בונוס החזר כספי",
];
const YouWillText = [
  "you will get 10% Bonus on all deposits after funds have been played. Withdrawing any amount of credits will reset the Cashback Bonus",
  "recibirás un bono del 10% en todos los depósitos después de que los fondos se hayan jugado. Retirar cualquier cantidad de créditos restablecerá el Bono de Devolución de Efectivo",
  "fondlar oynandıktan sonra tüm yatırımlarda %10 bonus alacaksınız. Herhangi bir kredi miktarını çekmek Cashback Bonusunu sıfırlar",
  "você receberá um bônus de 10% em todos os depósitos depois que os fundos forem jogados. Retirar qualquer quantidade de créditos redefinirá o Bônus de Cashback",
  "vous obtiendrez un bonus de 10% sur tous les dépôts après que les fonds aient été joués. Le retrait de n'importe quelle quantité de crédits réinitialisera le bonus de remboursement",
  "riceverai un bonus del 10% su tutti i depositi dopo che i fondi sono stati giocati. Il prelevamento di qualsiasi importo di crediti reimposterà il bonus di rimborso",
  "вы получите 10% бонуса на все депозиты после того, как средства будут сыграны. Вывод любой суммы кредитов сбросит Cashback Bonus",
  "תקבל בונוס של 10% על כל הפקדות לאחר שהכסף יושם. משיכת כל סכום של קרדיטים תאפס את בונוס ההחזר כספי",
];
const IfYouText = [
  "If you make a deposit right now with minimum amount 0.00, then you will have a chance to multiply your cashback bonus from 10% to 80% in the wheel of fortune",
  "Si haces un depósito ahora mismo con un monto mínimo de 0.00, tendrás la oportunidad de multiplicar tu bono de devolución de efectivo del 10% al 80% en la rueda de la fortuna",
  "Şu anda minimum 0,00 tutarında bir depozit yaparsanız, şansınızı deneme tekerleğinde %10 ile %80 arasında nakit iade bonusunuzu çarpmak için kullanabilirsiniz",
  "Se você fizer um depósito agora mesmo com o valor mínimo de 0.00, você terá a chance de multiplicar seu bônus de cashback de 10% a 80% na roda da fortuna",
  "Si vous effectuez un dépôt dès maintenant avec un montant minimum de 0,00, vous aurez la chance de multiplier votre bonus de remboursement de 10% à 80% dans la roue de la fortune",
  "Se effettui un deposito proprio ora con un importo minimo di 0,00, avrai la possibilità di moltiplicare il tuo bonus di rimborso dal 10% all'80% nella ruota della fortuna",
  "Если вы сделаете депозит прямо сейчас на минимальную сумму 0,00, то у вас будет шанс увеличить свой Cashback Bonus с 10% до 80% на колесе фортуны",
  "אם תבצע הפקדה עכשיו בסכום מינימלי של 0.00, אז יהיה לך הזדמנות להכפיל את בונוס ההחזר כספי שלך מ-10% עד 80% בגלגל המזל",
];

export const killIntervalRunning = () => {
  if (intervalRunning != null) {
    clearInterval(intervalRunning);
    intervalRunning = null;
  }
};

export const killIntervalRunningCurrentGame = () => {
  if (intervalRunningCurrentGame != null) {
    clearInterval(intervalRunningCurrentGame);
    intervalRunningCurrentGame = null;
  }
};

const GAMES_QUERY = gql`
  query GamesQuery {
    gr_games(
      order_by: {name: asc_nulls_last}
      where: {is_disabled: {_eq: false}}
    ) {
      id
      image
      name
      title
      exit_button
    }
    gv_games(
      order_by: { pname: asc_nulls_last }
      where: { is_disabled: { _eq: false } }
    ) {
      id
      pname
      image
      code
    }
    games(
      order_by: { gp_game_category: asc_nulls_last }
      where: { is_disabled: { _eq: false } }
    ) {
      id
      gp_game_category
      gp_game_image
      gp_game_menu_title
      gp_game_mobile
    }
    users {
      id
      shop {
        id
        disabled_games
        lobby
        is_aviator_enabled
      }
    }
    settings(order_by: { id: asc }) {
      value
      json_value
    }
    game_categories(order_by: { id: asc }) {
      id
      lobby
      categories
    }
  }
`;

const USER_QUERY = gql`
  query UserQuery {
    users {
      bonus
      credits
      wheel_of_fortune_multiplier
      current_game
      gp_user_id
      id
      is_enabled
      is_deleted
      is_panic
      last_login
      name
      shop_id
      username
      favorite_game_ids
      is_gaming_enabled
      shop {
        id
        gp_cur
        is_panic
        permissions
        jackpot_ids
        lobby
        shop_logo_url
        is_button_enabled_fullscreen
        is_button_enabled_logout
        is_button_enabled_mute
        is_button_enabled_search
      }
    }
  }
`;

const JACKPOT_QUERY = gql`
  query JackpotQuery($jackpot_ids: [Int!] = []) {
    jackpots(
      order_by: { current_value: desc }
      where: { id: { _in: $jackpot_ids } }
    ) {
      currency
      id
      level
      current_value
      jackpot_winners(limit: 1, order_by: { created_at: desc }) {
        award_value
        created_at
        id
        jackpot_id
        user_id
        jackpot {
          currency
          level
        }
      }
    }
  }
`;

const CURRENTGAME_MUTATION = gql`
  mutation setCurrentGame($id: Int = -1, $current_game: String = "") {
    update_users(
      where: { id: { _eq: $id } }
      _set: { current_game: $current_game }
    ) {
      affected_rows
    }
  }
`;

const ENABLE_GAMING_MUTATION = gql`
  mutation setEnableGaming($id: Int = -1, $is_gaming_enabled: Boolean = true) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { is_gaming_enabled: $is_gaming_enabled }
    ) {
      affected_rows
    }
  }
`;

const LASTLOGIN_MUTATION = gql`
  mutation setLastLogin($username: String = "", $last_login: timestamptz = "") {
    update_users(
      where: { username: { _eq: $username } }
      _set: { last_login: $last_login }
    ) {
      affected_rows
    }
  }
`;

const UPDATE_TIME_CURRENT_GAME_MUTATION = gql`
  mutation setUpdateCurrentGame(
    $id: Int = -1
    $last_update_of_current_game: timestamptz = ""
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { last_update_of_current_game: $last_update_of_current_game }
    ) {
      affected_rows
    }
  }
`;

const FAVORITEGAMES_MUTATION = gql`
  mutation FavoriteGamesMutation(
    $id: Int = -1
    $favorite_game_ids: jsonb = ""
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { favorite_game_ids: $favorite_game_ids }
    ) {
      affected_rows
    }
  }
`;

var login_username_focus = true;
var windowVertical = false;
var isFullScreen = false;
var first_time = true;
var from_login = false;
let the_shop_currency = "R";

const ThePage = () => {
  // const [ChosenLobby, setChosenLobby] = useState("go_hr_to_spin");
  const [SkipUntilLogin, setSkipUntilLogin] = useState(true);
  const [EnableButtonFullScreen, setEnableButtonFullScreen] = useState(true);
  const [EnableButtonLogout, setEnableButtonLogout] = useState(true);
  const [EnableButtonMute, setEnableButtonMute] = useState(true);
  const [TheGames, setTheGames] = useState([]);
  const [TheGamesCategories, setTheGamesCategories] = useState([]);
  const [TheGamesCategoriesImages, setTheGamesCategoriesImages] = useState([]);
  const [GamesToShow, setGamesToShow] = useState([]);
  const [TopGamesShown, setTopGamesShown] = useState([]);
  const [TheFavorites, setTheFavorites] = useState([]);
  const [TheFavoritesIds, setTheFavoritesIds] = useState([]);
  const [TheTopGames, setTheTopGames] = useState([]);
  const [TheNewGames, setTheNewGames] = useState([]);
  const [ShowLobby, setShowLobby] = useState(true);
  const [GamesToShowAllSlides, setGamesToShowAllSlides] = useState(1);
  const [GamesToShowCurrentSlide, setGamesToShowCurrentSlide] = useState(1);
  const [SlidesToShow, setSlidesToShow] = useState(3);
  const [SlidesToShowGamesTop, setSlidesToShowGamesTop] = useState(7);
  const [SlidesToShowGames, setSlidesToShowGames] = useState(3);
  const [LoginScreen, setLoginScreen] = useState(false);
  const [LoadingReady, setLoadingReady] = useState(false);
  const [LoadingReady2, setLoadingReady2] = useState(false);
  const [LoadingReady3, setLoadingReady3] = useState(false);
  const [JackpotActivated, setJackpotActivated] = useState(false);
  const [MessageActivated, setMessageActivated] = useState(false);
  const [TheJackpotWinnerValue, setTheJackpotWinnerValue] = useState("");
  const [TheJackpotWinnerLevel, setTheJackpotWinnerLevel] = useState("");
  const [TheJackpotWinnerUser, setTheJackpotWinnerUser] = useState("");
  const [JackpotLandscape, setJackpotLandscape] = useState(true);
  const [RevealX, setRevealX] = useState(false);
  const [StartSpin, setStartSpin] = useState(false);
  const [TransformJackpotVertical, setTransformJackpotVertical] = useState(1);
  const [TransformJackpotHorizontal, setTransformJackpotHorizontal] =
    useState(1);
  const [DropdownActive, setDropdownActive] = useState(false);
  const [InfoActive, setInfoActive] = useState(false);
  const [InfoActiveCashback, setInfoActiveCashback] = useState(false);
  const [ShowTopCategory, setShowTopCategory] = useState(null);
  const [TheLanguageIndex, setTheLanguageIndex] = useState(0);
  const [KeepLobbyIndex, setKeepLobbyIndex] = useState(0);
  const [ProviderIndex, setProviderIndex] = useState(0);
  const [TheSpecificGameCategory, setTheSpecificGameCategory] = useState("");
  const [ActivateExit, setActivateExit] = useState(false);

  const [FrameUrl, setFrameUrl] = useState("");

  const [AudioPlaying, setAudioPlaying] = useState(false);
  const [GameStarted, setGameStarted] = useState(false); //here
  const [AviatorStarted, setAviatorStarted] = useState(false); //here
  const [AviatorStartedWebsite, setAviatorStartedWebsite] = useState(
    `${process.env.REACT_APP_AVIATOR_WEBSITE}?token=${locToken}`
  ); //here
  const [OverAStar, setOverAStar] = useState(false);
  const [TheCurrency, setTheCurrency] = useState("R");

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const [TheShopLogo, setTheShopLogo] = useState("---");
  const [DarkMode, setDarkMode] = useState(false);
  const [Novomatic_big_Exit, setNovomatic_big_Exit] = useState(true);
  const [HalfScreen, setHalfScreen] = useState(false);
  const [TheWheelOfFortuneActivation, setTheWheelOfFortuneActivation] =
    useState(false); //here

  const [IsMobile, setIsMobile] = useState(false);
  const [TheWheelOfFortuneValue, setTheWheelOfFortuneValue] = useState(1);

  // const [HalfScreenImage, setHalfScreenImage] = useState(null);
  const [Jackpot_Ids, setJackpot_Ids] = useState([]);
  const [TheJackpotValues, setTheJackpotValues] = useState([
    {
      name: "Grand",
      value: "0.00",
    },
    {
      name: "Diamond",
      value: "0.00",
    },
    {
      name: "Platinum",
      value: "0.00",
    },
    {
      name: "Gold",
      value: "0.00",
    },
    {
      name: "Silver",
      value: "0.00",
    },
    {
      name: "Bronze",
      value: "0.00",
    },
    {
      name: "Iron",
      value: "0.00",
    },
  ]);

  const myAudio = useRef(new Audio(the_sound));
  const myAudioWinner = useRef(new Audio(the_sound_winner));
  const myAudioSpinning = useRef(new Audio(the_spinning_sound));
  myAudio.loop = true;

  const segments = {
    1: 1,
    2: 12,
    3: 8,
    4: -4,
    5: 10,
    6: -6,
    8: 4,
  };

  const spinning_element = document.getElementById("the_spinning_wheel");
  spinning_element?.addEventListener("animationend", () => {
    setRevealX(true);
    playSoundWinner();
  });

  const sliderRef = useRef(null);
  const sliderGamesRef = useRef(null);
  const sliderRefTop = useRef(null);

  const { refetch: refetch_games } = useQuery(GAMES_QUERY, {
    onCompleted: async (the_data) => {
      if (GameStarted) {
        console.log("Game has Started!!!");
        return;
      }

      const the_games_gp = the_data.games;
      const the_games_gv = the_data.gv_games;
      const the_games_gr = the_data.gr_games;

      let the_games = [];

      for (let i = 0; i < the_games_gp.length; i++) {
        the_games.push({
          id: the_games_gp[i].id,
          category: the_games_gp[i].gp_game_category,
          image: the_games_gp[i].gp_game_image,
          title: the_games_gp[i].gp_game_menu_title,
          mobile: the_games_gp[i].gp_game_mobile,
          provider: "gpgames",
          exit_button: false,
        });
      }

      for (let i = 0; i < the_games_gv.length; i++) {
        the_games.push({
          id: the_games_gv[i].id,
          category: the_games_gv[i].pname,
          image: the_games_gv[i].image,
          title: the_games_gv[i].code,
          mobile: 1,
          provider: "gvgames",
          exit_button: false,
        });
      }

      for (let i = 0; i < the_games_gr.length; i++) {
        the_games.push({
          id: the_games_gr[i].id,
          category: the_games_gr[i].title,
          image: the_games_gr[i].image,
          title: the_games_gr[i].name,
          mobile: 1,
          provider: "grgames",
           // eslint-disable-next-line
          exit_button: the_games_gr[i].exit_button == 1,
        });
      }

      const the_disabled_games = the_data.users[0].shop.disabled_games;

      const the_lobby = the_data.users[0].shop.lobby;
      const the_aviator_enabled = the_data.users[0].shop.is_aviator_enabled;

      let the_query_games_categories = null;
      for (let i = 0; i < the_data.game_categories.length; i++) {
        if (the_data.game_categories[i].lobby === the_lobby) {
          the_query_games_categories = the_data.game_categories[i].categories;
          break;
        }
      }

      let all_the_games = [];

      let games_categories = [];
      let game_categories_images = [];
      let the_index = -1;

      const the_new_games = the_data.settings[2].json_value;

      let is_mobile;
      const navigator = window.navigator.userAgent;
      if (
        navigator.match(/Android/i) ||
        navigator.match(/webOS/i) ||
        navigator.match(/iPhone/i) ||
        navigator.match(/iPad/i) ||
        navigator.match(/iPod/i) ||
        navigator.match(/BlackBerry/i) ||
        navigator.match(/Windows Phone/i)
      ) {
        is_mobile = true;
      } else {
        is_mobile = false;
      }

      let predetermined_categories = true;

      if (the_query_games_categories !== null) {
        predetermined_categories = false;

        let the_category_title = "";
        let the_category_banner_img = undefined;
        let the_category_general = [];
        let the_game_id = -1;

        games_categories = [];

        for (let b = 0; b < the_query_games_categories.length; b++) {
          the_index = b;
          all_the_games[the_index] = [];

          the_category_title = the_query_games_categories[b].Category_Label;
          the_category_banner_img = the_query_games_categories[b].Banner_Img;
          the_category_general = the_query_games_categories[b].Game_Ids;

          for (let x = 0; x < the_category_general.length; x++) {
            the_game_id = the_category_general[x];

            for (let i = 0; i < the_games.length; i++) {
              if (
                the_games[i].id !== the_game_id.id ||
                the_games[i].provider !== the_game_id.provider
              ) {
                continue;
              }

              let is_disabled = false;

              for (let j = 0; j < the_disabled_games.length; j++) {
                if (
                  the_games[i].id === the_disabled_games[j].id &&
                  the_games[i].provider === the_disabled_games[j].provider
                ) {
                  is_disabled = true;
                  break;
                }
              }

              if (
                window.innerWidth < window.innerHeight &&
                is_mobile &&
                the_games[i].mobile !== 1
              ) {
                continue;
              }

              if (is_disabled) {
                continue;
              }

              let found_new = false;
              for (let x = 0; x < the_new_games.length; x++) {
                if (
                  the_new_games[x].id === the_games[i].id &&
                  the_new_games[x].provider === the_games[i].provider
                ) {
                  found_new = true;
                  break;
                }
              }

              let tmp_game = { ...the_games[i] };
              tmp_game.is_new = found_new;

              all_the_games[the_index].push(tmp_game);

              break;
            }
          }

          games_categories.push(the_category_title);

          if (the_category_banner_img !== undefined) {
            game_categories_images.push(the_category_banner_img);
          } else {
            if (all_the_games[the_index][0] !== undefined) {
              for (let jj = 0; jj < images.length; jj++) {
                if (
                  all_the_games[the_index][0].category === "novomatic,table" &&
                  images[jj].includes("bingo")
                ) {
                  game_categories_images.push(images[jj]);
                  break;
                }
                // if (images[jj].includes(all_the_games[the_index][0].category)) {
                if (images[jj].includes(the_category_title.toLowerCase())) {
                  game_categories_images.push(images[jj]);
                  break;
                }
              }
            }
          }

          if (game_categories_images.length !== games_categories.length) {
            game_categories_images.push("");
          }
        }

        for (let i = 0; i < all_the_games.length; ) {
          if (all_the_games[i].length === 0) {
            all_the_games.splice(i, 1);
            games_categories.splice(i, 1);
            game_categories_images.splice(i, 1);
          } else {
            i++;
          }
        }


        setTheGamesCategories(games_categories);
        setTheGamesCategoriesImages(game_categories_images);
        setTheGames(all_the_games);
      }

      if (predetermined_categories) {
        for (let i = 0; i < the_games.length; i++) {
          let is_disabled = false;

          for (let j = 0; j < the_disabled_games.length; j++) {
            if (
              the_games[i].id === the_disabled_games[j].id &&
              the_games[i].provider === the_disabled_games[j].provider
            ) {
              is_disabled = true;
              break;
            }
          }

          if (
            window.innerWidth < window.innerHeight &&
            is_mobile &&
            the_games[i].mobile !== 1
          ) {
            continue;
          }

          if (is_disabled) {
            continue;
          }

          let found_new = false;
          for (let x = 0; x < the_new_games.length; x++) {
            if (
              the_new_games[x].id === the_games[i].id &&
              the_new_games[x].provider === the_games[i].provider
            ) {
              found_new = true;
              break;
            }
          }
          let tmp_game = { ...the_games[i] };
          tmp_game.is_new = found_new;

          if (!games_categories.includes(tmp_game.category)) {
            all_the_games[games_categories.length] = [];
            all_the_games[games_categories.length].push(tmp_game);

            games_categories.push(tmp_game.category);
            for (let j = 0; j < images.length; j++) {
              if (tmp_game.category === "novomatic,table") {
                if (images[j].includes("bingo")) {
                  game_categories_images.push(images[j]);
                  break;
                }
              } else if (images[j].includes(tmp_game.category)) {
                game_categories_images.push(images[j]);
                break;
              }
            }
            if (game_categories_images.length !== games_categories.length) {
              game_categories_images.push("");
            }
          } else {
            the_index = games_categories.indexOf(tmp_game.category);

            all_the_games[the_index].push(tmp_game);
          }
        }
      }

      if (predetermined_categories) {
        for (let i = 0; i < games_categories.length; i++) {
          if (games_categories[i] === "novomatic,table") {
            games_categories[i] = "bingo";
          }
        }
      }

      if (the_aviator_enabled) {
        for (let i = 0; i < images.length; i++) {
          if (images[i].includes("aviator")) {
            game_categories_images.unshift(images[i]);
            games_categories.unshift("aviator");
            all_the_games.unshift([]);
          }
        }
      }

      setTheGamesCategories(games_categories);
      setTheGamesCategoriesImages(game_categories_images);

      setTheGames(all_the_games);

      setLoadingReady2(true);

      let coming_from_game = await localStorage.getItem("KeepLobbyIndex");

      if (coming_from_game !== undefined && coming_from_game !== null) {
        await restorePositionOfSlicker(all_the_games);
        deleteLocalStorage();
      }

      const the_top_games = the_data.settings[1].json_value;

      let final_top_games = [];

      for (let x = 0; x < the_top_games.length; x++) {
        let found = false;
        for (let i = 0; i < all_the_games.length; i++) {
          for (let j = 0; j < all_the_games[i].length; j++) {
            if (
              the_top_games[x].id === all_the_games[i][j].id &&
              the_top_games[x].provider === all_the_games[i][j].provider
            ) {
              final_top_games.push({ ...all_the_games[i][j] });
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }

      setTheTopGames(final_top_games);

      let final_new_games = [];

      for (let x = 0; x < the_new_games.length; x++) {
        let found = false;
        for (let i = 0; i < all_the_games.length; i++) {
          for (let j = 0; j < all_the_games[i].length; j++) {
            if (
              the_new_games[x].id === all_the_games[i][j].id &&
              the_new_games[x].provider === all_the_games[i][j].provider
            ) {
              final_new_games.push({ ...all_the_games[i][j] });
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }

      setTheNewGames(final_new_games);
    },
    onError: (err) => {
      console.log(err);
      console.log(locToken);
    },
    skip: SkipUntilLogin,
    notifyOnNetworkStatusChange: true,
    pollInterval: 60000,
  });

  const restorePositionOfSlicker = async (all_the_games) => {
    const loc_GamesToShowAllSlides = await parseInt(
      localStorage.getItem("GamesToShowAllSlides")
    );
    const loc_GamesToShowCurrentSlide = await parseInt(
      localStorage.getItem("GamesToShowCurrentSlide")
    );
    const loc_SlidesToShowGames = await parseInt(
      localStorage.getItem("SlidesToShowGames")
    );
    const loc_KeepLobbyIndex = await parseInt(
      localStorage.getItem("KeepLobbyIndex")
    );
    const loc_TheLanguageIndex = await parseInt(
      localStorage.getItem("TheLanguageIndex")
    );

    const the_index = await parseInt(localStorage.getItem("ProviderIndex"));

    const loc_ShowLobby = await localStorage.getItem("ShowLobby");

    await setGamesToShowAllSlides(loc_GamesToShowAllSlides);
    await setGamesToShowCurrentSlide(loc_GamesToShowCurrentSlide);
    await setSlidesToShowGames(loc_SlidesToShowGames);
    await setKeepLobbyIndex(loc_KeepLobbyIndex);
    await setTheLanguageIndex(loc_TheLanguageIndex);

    await setProviderIndex(the_index);
    await setGamesToShow(all_the_games[the_index]);

    // eslint-disable-next-line
    await setShowLobby(loc_ShowLobby == "true");
  };

  const deleteLocalStorage = () => {
    localStorage.removeItem("GamesToShowAllSlides");
    localStorage.removeItem("GamesToShowCurrentSlide");
    localStorage.removeItem("SlidesToShowGames");
    localStorage.removeItem("KeepLobbyIndex");
    localStorage.removeItem("TheLanguageIndex");
    localStorage.removeItem("ProviderIndex");
    localStorage.removeItem("ShowLobby");
    console.log("deleted")
  };

  window.addEventListener("message", function (event) {
    // eslint-disable-next-line
    if (event.data == "closeGame") {
      window.removeGame();
    }
  });
  window.removeGame = function () {
    if(window.location.pathname.includes("exit")){
      window.parent.location.href = window.location.protocol + '//' + window.location.host
    }
    else{
      setGameStarted(false);
      setFrameUrl("");
      setHalfScreen(false);
      setAviatorStarted(false);
      deleteLocalStorage();
    }
  };

  const { data: data_user, refetch: refetch_user } = useQuery(USER_QUERY, {
    onCompleted: async (data) => {
      if (first_time) {
        setLoadingReady3(true);

        if (data.users[0].is_deleted) {
          returnEverythingToNormal();
          return;
        }

        set_Current_Game({
          variables: {
            id: data.users[0].id,
            current_game: "---",
          },
        });
        first_time = false;
      }

      if (from_login) {
        playSound();
        from_login = false;
      }

      const the_shop = data.users[0].shop;

      if (
        the_shop.lobby !== "go_hr_to_spin"
      ) {
        alert("User not found in this lobby!");
        returnEverythingToNormal();
        return;
      } else if (window.location.hostname !== "localhost") {
        if (!window.location.hostname.includes("spincity")) {
          alert("User not found in this lobby!");
          returnEverythingToNormal();
          return;
        }
      }

      const the_jackpot_ids = the_shop.jackpot_ids;

      const parsedObject = JSON.parse(the_shop.permissions);
      const arrayOfObjects = Object.values(parsedObject);

      const safePage = arrayOfObjects
        .find(
          (obj) =>
            obj["key"] ===
            "Redirect to specific safe urls. Leave blank for default webpage. Press save."
        )
        .value.replace("https://", "")
        .replace("http://", "");

      const enable_to_safe = arrayOfObjects.find(
        (obj) =>
          obj["key"] ===
          "Enabled: leave completely from games to safe url when pressing ON/OFF or ESC. Disabled: redirect back to games on pressing ON/OFF (some urls will not work)"
      ).value;

      const Novomatic_big_Exit = arrayOfObjects.find(
        (obj) => obj["key"] === "Novomatic big exit"
      ).value;

      if (data.users[0].shop.is_panic) {
        returnEverythingToNormal();
        window.location.href = "https://" + safePage;
        return;
      }

      if (!data.users[0].is_enabled) {
        if (enable_to_safe) {
          window.location.href = "https://" + safePage;
          returnEverythingToNormal();
        } else {
          setDarkMode(true);
        }
        return;
      } else {
        setDarkMode(false);
      }

      // setThe_Safe_page(safePage); //9
      setNovomatic_big_Exit(Novomatic_big_Exit); //6

      const the_favorites = data.users[0].favorite_game_ids;

      let final_favorites = [];

      for (let x = 0; x < the_favorites.length; x++) {
        let found = false;
        for (let i = 0; i < TheGames.length; i++) {
          for (let j = 0; j < TheGames[i].length; j++) {
            if (the_favorites[x] === TheGames[i][j].id) {
              final_favorites.push({ ...TheGames[i][j] });
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }

      if (the_shop.shop_logo_url !== "---") {
        setTheShopLogo(the_shop.shop_logo_url);
      }

      setEnableButtonFullScreen(the_shop.is_button_enabled_fullscreen);
      setEnableButtonLogout(the_shop.is_button_enabled_logout);
      setEnableButtonMute(the_shop.is_button_enabled_mute);

      setTheFavorites(final_favorites);
      setTheFavoritesIds(data.users[0].favorite_game_ids);

      setJackpot_Ids(the_jackpot_ids);

      the_shop_currency = FindSymbol(the_shop.gp_cur, the_shop.lobby);
      setTheCurrency(the_shop_currency);
      // setChosenLobby(the_shop.lobby);

      let the_wheel_value = parseInt(data.users[0].wheel_of_fortune_multiplier);

      let flag = false;

      if (data.users[0].bonus > 0) {
        previous_bonus = true;
      } else {
        if (previous_bonus) {
          flag = true;
        }
        previous_bonus = false;
      }

      document
        .querySelector(":root")
        .style.setProperty(
          "--spinning_degrees",
          1080 - segments["" + (the_wheel_value - 1)] * 18 + "deg"
        );

      if (!TheWheelOfFortuneActivation) {
        let activation = the_wheel_value !== 1 && flag ? true : false;

        if (activation) {
          await new Promise((r) => setTimeout(r, 2000));
        }
        setTheWheelOfFortuneActivation(activation);

        if (data.users[0].bonus !== 0) {
          setTheWheelOfFortuneValue(
            parseInt(((the_wheel_value - 1) * data.users[0].bonus) / 100) + ""
          );
        }
      }
    },
    onError: (err) => {
      console.log(err);
      console.log(locToken);
    },
    skip: SkipUntilLogin,
    notifyOnNetworkStatusChange: true,
    pollInterval: 1000,
  });

  useQuery(JACKPOT_QUERY, {
    variables: {
      jackpot_ids: Jackpot_Ids,
    },
    onCompleted: async (data) => {
      const the_jackpots = data.jackpots;
      if (the_jackpots.length === 0) {
        return;
      }

      let the_jackpot_values = [...TheJackpotValues];

      for (let i = 0; i < the_jackpots.length; i++) {
        for (let j = 0; j < the_jackpot_values.length; j++) {
          if (
            the_jackpots[i].level.toLowerCase() ===
            the_jackpot_values[j].name.toLowerCase()
          ) {
            the_jackpot_values[j] = {
              name: the_jackpot_values[j].name,
              value: (the_jackpots[i].current_value / 100).toFixed(2),
            };
            break;
          }
        }
      }

      setTheJackpotValues(the_jackpot_values);

      let last_winner;
      if (data_user === undefined || data_user.users === undefined) {
        return;
      }

      if (!data_user.users[0].is_gaming_enabled) {
        for (let i = 0; i < the_jackpots.length; i++) {
          last_winner = the_jackpots[i].jackpot_winners[0];
          if (
            last_winner !== undefined &&
            last_winner.user_id === data_user.users[0].id
          ) {
            break;
          }
        }
      } else {
        last_winner = the_jackpots[0].jackpot_winners[0];

        for (let i = 1; i < the_jackpots.length; i++) {
          let new_last_winner = the_jackpots[i].jackpot_winners[0];
          if (new_last_winner !== undefined && last_winner !== undefined) {
            if (
              moment(new_last_winner.created_at).diff(
                moment(last_winner.created_at)
              ) > 0
            ) {
              last_winner = the_jackpots[i].jackpot_winners[0];
            }
          }
        }

        if (last_winner === undefined || last_winner === null) {
          return;
        }

        if (moment().diff(moment(last_winner.created_at)) > 30000) {
          return;
        }
      }

      const the_id = last_winner.id;

      const the_loc_jackpot_id = localStorage.getItem("loc_jack_id");

      if (the_loc_jackpot_id !== undefined && the_loc_jackpot_id !== null) {
        if (parseInt(the_id) === parseInt(the_loc_jackpot_id)) {
          return;
        }
      }

      localStorage.setItem("loc_jack_id", the_id);

      const the_level = last_winner.jackpot.level;
      const the_value =
        (last_winner.award_value / 100).toFixed(2) + the_shop_currency;
      const the_user = last_winner.user_id;

      if (data_user.users.length === 0) {
        return;
      }

      setTheJackpotWinnerValue(the_value);
      setTheJackpotWinnerLevel(the_level);

      if (the_user === data_user.users[0].id) {
        setJackpotActivated(true);
        playSoundWinner();
      } else {
        setMessageActivated(true);
        setTheJackpotWinnerUser(the_user);
      }
    },
    onError: (err) => {
      console.log(err);
      console.log(locToken);
    },
    skip: SkipUntilLogin,
    notifyOnNetworkStatusChange: true,
    pollInterval: 1000,
  });

  // const { data: data_settings, refetch: refetch_settings } = useQuery(
  //   SETTINGS_QUERY,
  //   {
  //     onError: (err) => {
  //       console.log(err);
  //       console.log(locToken);
  //     },
  //     skip: SkipUntilLogin,
  //   }
  // );

  const [set_Update_Time_Current_Game] = useMutation(
    UPDATE_TIME_CURRENT_GAME_MUTATION,
    {
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const [set_Current_Game] = useMutation(CURRENTGAME_MUTATION);
  const [set_Last_Login_Game] = useMutation(LASTLOGIN_MUTATION);
  const [set_Enable_Gaming] = useMutation(ENABLE_GAMING_MUTATION);
  const [set_Favorite_Game] = useMutation(FAVORITEGAMES_MUTATION, {
    onCompleted: () => {
      refetchQueries();
    },
  });

  useEffect(
    () => {

      
      if(window.location.pathname.includes("exit") || window.self !== window.top){
        window.parent.location.href = window.location.protocol + '//' + window.location.host
      }
      // else{
      //   console.log(window.location.pathname)
      // }


      document.body.classList.add("go2spin");

      My_website = window.location.href;
      let is_mobile;

      const navigator = window.navigator.userAgent;

      if (
        navigator.match(/Android/i) ||
        navigator.match(/webOS/i) ||
        navigator.match(/iPhone/i) ||
        navigator.match(/iPad/i) ||
        navigator.match(/iPod/i) ||
        navigator.match(/BlackBerry/i) ||
        navigator.match(/Windows Phone/i)
      ) {
        is_mobile = true;
      } else {
        is_mobile = false;
      }
      setIsMobile(is_mobile);
      if (is_mobile) {
        openFullscreen(document.documentElement);
        document.body.classList.add("mobile-game");
      } else {
        document.body.classList.remove("mobile-game");
      }

      AdjustSizeFunction();

      window.addEventListener("resize", AdjustSizeFunction);

      if (document.addEventListener) {
        document.addEventListener("fullscreenchange", exitHandler, false);
        document.addEventListener("mozfullscreenchange", exitHandler, false);
        document.addEventListener("MSFullscreenChange", exitHandler, false);
        document.addEventListener("webkitfullscreenchange", exitHandler, false);
      }

      locToken = sessionStorage.getItem("token_Lobby_Fruit_Rush");

      if (
        sessionStorage.getItem("token_Lobby_Fruit_Rush") === undefined ||
        sessionStorage.getItem("token_Lobby_Fruit_Rush") === null
      ) {
        setLoginScreen(true);
        setSkipUntilLogin(true);
        setLoadingReady(false);
        setLoadingReady2(false);
        setLoadingReady3(false);
        first_time = true;
        killIntervalRunning();
        killIntervalRunningCurrentGame();
      } else {
        setSkipUntilLogin(false);
        fetchData();
      }
    },
    // eslint-disable-next-line
    []
  );

  const theClassName = (i, the_dropdownActive) => {
    if (the_dropdownActive) {
      if (i === TheLanguageIndex) {
        return "select-language selected active";
      } else {
        return "select-language active";
      }
    } else {
      if (i === TheLanguageIndex) {
        return "select-language selected";
      } else {
        return "select-language";
      }
    }
  };

  const ReturnTheRightText = (textType) => {
    switch (textType) {
      case "balance":
        return BalanceText[TheLanguageIndex];
      case "bonus":
        return BonusText[TheLanguageIndex];
      case "exit":
        return ExitText[TheLanguageIndex];
      case "menu":
        return MenuText[TheLanguageIndex];
      case "INFO":
        return InfoText[TheLanguageIndex];
      case "Favorites":
        return FavoritesText[TheLanguageIndex];
      case "Top":
        return TopText[TheLanguageIndex];
      case "New":
        return NewText[TheLanguageIndex];
      case "Cashback":
        return CashbackText[TheLanguageIndex];
      case "YouWill":
        return YouWillText[TheLanguageIndex];
      case "IfYou":
        return IfYouText[TheLanguageIndex];
      case "Find":
        return FindText[TheLanguageIndex];
      case "Yes":
        return YesText[TheLanguageIndex];
      case "No":
        return NoText[TheLanguageIndex];
      case "AreYouSure":
        return AreYouSureText[TheLanguageIndex];
      default:
        return "";
    }
  };

  const playSound = () => {
    myAudio.current.play();
    setAudioPlaying(true);
  };

  const playSoundWinner = () => {
    myAudioWinner.current.play();
  };
  const playSoundSpinning = () => {
    myAudioSpinning.current.play();
  };

  const stopSound = () => {
    myAudio.current.pause();
    setAudioPlaying(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    slidesPerRow: SlidesToShow,
    arrows: false,
  };

  const settingsGames = {
    infinite: true,
    arrows: false,
    centerPadding: "0px",
    slidesToShow: 1,
    speed: 500,
    rows: SlidesToShowGames,
    slidesPerRow: SlidesToShowGames,
  };

  const settingsTop = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: SlidesToShowGamesTop,
    slidesToScroll: SlidesToShowGamesTop,
    arrows: false,
  };

  async function returnTheLink(//change
    game_provider,
    game_code,
    gp_user_id,
    language,
    exit_url
  ) {
    let is_mobile;

    const navigator = window.navigator.userAgent;

    if (
      navigator.match(/Android/i) ||
      navigator.match(/webOS/i) ||
      navigator.match(/iPhone/i) ||
      navigator.match(/iPad/i) ||
      navigator.match(/iPod/i) ||
      navigator.match(/BlackBerry/i) ||
      navigator.match(/Windows Phone/i)
    ) {
      is_mobile = true;
    } else {
      is_mobile = false;
    }

    locToken = await sessionStorage.getItem("token_Lobby_Fruit_Rush");
    let response = "";

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: locToken,
        game_provider: game_provider,
        game_code: game_code,
        gp_user_id: gp_user_id,
        language: language,
        backend_url: process.env.REACT_APP_BACKEND_URL,
        exit_url: exit_url,
        is_mobile: is_mobile,
      }),
    };
    try {
      response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/frontend/open-game-session/",
        requestOptions
      );
    } catch (error) {
      console.log(error);
      alert(error)
      return "error";
    }
    if (response.status !== 200) {
      const result_err = await response.json()
      console.log(result_err);
      alert(result_err)
      return "error";
    }

    const result = await response.json();

    const result_ans = result.game_url;

    return result_ans;
  }

  async function fetchData() {
    refetchQueries();

    locToken = await sessionStorage.getItem("token_Lobby_Fruit_Rush");
    let response = "";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: locToken }),
    };
    try {
      response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/frontend/whoami/",
        requestOptions
      );
    } catch (error) {
      console.log(error);
      if (second_time_error) {
        returnEverythingToNormal();
      } else {
        second_time_error = true;
        console.log("first time error");
      }
      return;
    }
    if (response.status !== 200) {
      returnEverythingToNormal();
      return;
    }

    second_time_error = false;

    loggedInUser = 1;
    setLoginScreen(false);

    if (intervalRunning === null && loggedInUser === 1) {
      intervalRunning = setInterval(checkAliveToken, 5000);
      intervalRunningCurrentGame = setInterval(
        checkAliveTokenCurrentGame,
        20000
      );
    }

    document.body.classList.add("authorized");
    document.body.classList.add("with-lang-select");
    // AdjustSizeFunction();

    // window.addEventListener("resize", AdjustSizeFunction);
  }

  function FindSymbol(symbol, lobby) {
    switch (symbol) {
      case "EUR":
        return "€";
      case "USD":
        return "$";
      case "ZAR":
        return "ZAR";
      default:
        return symbol;
    }
  }

  function exitHandler() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      isFullScreen = false;
    }
  }

  function refetchQueries() {
    refetch_user();
    refetch_games();
  }

  const checkAliveTokenCurrentGame = async () => {
    if (intervalRunningCurrentGame == null) {
      return;
    }
    const right_now = moment().format("YYYY-MM-DDTHH:mm:ssZ");
    const currentUserID = parseInt(localStorage.getItem("lobby_id"));

    set_Update_Time_Current_Game({
      variables: {
        id: currentUserID,
        last_update_of_current_game: right_now,
      },
    });
  };

  const checkAliveToken = async () => {
    let response = "";
    locToken = await sessionStorage.getItem("token_Lobby_Fruit_Rush");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: locToken }),
    };
    if (intervalRunning == null) {
      return;
    }
    try {
      response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/frontend/whoami/",
        requestOptions
      );
    } catch (error) {
      console.log(error);
      if (second_time_error) {
        returnEverythingToNormal();
      } else {
        second_time_error = true;
        console.log("first time error");
      }
      return;
    }
    if (response.status !== 200) {
      console.log(response);
      returnEverythingToNormal();
      return;
    }
    second_time_error = false;
  };

  const signin = async (usernamein, passwordin) => {
    if (semaphoreLogin >= 1) {
      return;
    }

    semaphoreLogin += 1;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernamein,
        password: passwordin,
        client_type: "user",
      }),
    };

    try {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/frontend/authenticate/",
        requestOptions
      );

      if (response.status !== 200) {
        console.log("Not 200");
        alert("Wrong Password");
        semaphoreLogin -= 1;
        return;
      }

      let result = await response.json();

      if (result.status !== undefined) {
        setPassword("");
        document.getElementById("Username Login").focus();
        alert("Wrong Password");
        semaphoreLogin -= 1;
        return;
      }
      // Do things with result
      userLoggedInFlag = 1;

      currentUser = usernamein;
      setSkipUntilLogin(false);
      sessionStorage.setItem("token_Lobby_Fruit_Rush", String(result.token));
      const currentUserID = parseInt(result.client_id);
      localStorage.setItem("lobby_id", currentUserID);

      from_login = true;
      fetchData();

      const right_now = moment().format("YYYY-MM-DDTHH:mm:ssZ");

      set_Last_Login_Game({
        variables: {
          username: currentUser,
          last_login: right_now,
        },
      });

      if (IsMobile) {
        openFullscreen(document.documentElement);
      }

      semaphoreLogin -= 1;
    } catch (error) {
      alert("Error occurred");
      console.log(error);
      semaphoreLogin -= 1;
    }
  };

  function next() {
    sliderRef.current.slickNext();
  }
  function previous() {
    sliderRef.current.slickPrev();
  }

  function nextGames() {
    sliderGamesRef.current.slickNext();
  }
  function previousGames() {
    sliderGamesRef.current.slickPrev();
  }

  function AdjustSizeFunction() {
    if (window.innerWidth < window.innerHeight || window.orientation === 0) {
      setJackpotLandscape(false);
      setTransformJackpotVertical(window.innerWidth / 1080);
      setTransformJackpotHorizontal(window.innerHeight / 1920);

      if (!windowVertical) {
        document.body.classList.add("vertical");
        document.body.classList.remove("horizontal");
        windowVertical = true;
        setSlidesToShowGames(3);
        setSlidesToShowGamesTop(6);

        // if(window.innerWidth === 1080 && window.innerHeight === 1920){
        //   document.body.classList.add("thirty_two_inch");
        // }
      }
      if (window.innerWidth <= 500) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    } else {
      setJackpotLandscape(true);
      setTransformJackpotVertical(window.innerWidth / 1920);
      setTransformJackpotHorizontal(window.innerHeight / 1080);

      if (windowVertical) {
        document.body.classList.add("horizontal");
        document.body.classList.remove("vertical");
        windowVertical = false;
        setSlidesToShowGamesTop(7);
      }
      if (window.innerWidth <= 1270) {
        setSlidesToShow(2);
        setSlidesToShowGames(2);
      } else {
        setSlidesToShow(3);
        setSlidesToShowGames(3);
      }
    }
  }

  const logOut = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: locToken }),
    };
    await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/frontend/logout/",
      requestOptions
    );

    returnEverythingToNormal();
  };

  const returnEverythingToNormal = () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    stopSound();
    killIntervalRunning();
    killIntervalRunningCurrentGame();
    setTheGames([]);
    setTheGamesCategories([]);
    setTheGamesCategoriesImages([]);
    setGamesToShow([]);
    setShowLobby(true);
    setGamesToShowAllSlides(1);
    setGamesToShowCurrentSlide(1);
    setSlidesToShow(3);
    setSlidesToShowGames(12);
    setSlidesToShowGames(3);
    setKeepLobbyIndex(0);
    setTheLanguageIndex(0);

    setAudioPlaying(false);
    setUsername("");
    setPassword("");

    setLoginScreen(true);
    setLoadingReady(false);
    setLoadingReady2(false);
    setLoadingReady3(false);

    setSkipUntilLogin(true);
    first_time = true;

    //static variables
    loggedInUser = 0;
    second_time_error = false;
    previous_bonus = false;
    from_login = false;

    //refresh
    window.location.reload();
  };

  function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
    isFullScreen = true;
  }

  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  }

  const providerPressed = async (index) => {
    const keep_index = parseInt(index / SlidesToShow);

    if (TheGamesCategories[index] === "aviator") {
      GamePressedAviator(keep_index);
      return;
    }

    setGamesToShow(TheGames[index]);
    setKeepLobbyIndex(keep_index);

    setShowLobby(false);

    if (SlidesToShowGames === 3) {
      setGamesToShowAllSlides(parseInt((TheGames[index].length - 1) / 9) + 1);
    } else {
      setGamesToShowAllSlides(parseInt((TheGames[index].length - 1) / 4) + 1);
    }
    setGamesToShowCurrentSlide(1);
  };

  const mouseDownCoords = (e) => {
    window.checkForDrag = e.clientX;
  };

  const clickOrDrag = (e, index) => {
    const mouseUp = e.clientX;
    if (
      mouseUp < window.checkForDrag + 5 &&
      mouseUp > window.checkForDrag - 5
    ) {
      providerPressed(index);
      setProviderIndex(index);
    }
  };

  const mouseDownCoordsGames = (e) => {
    window.checkForDrag = e.clientX;
  };

  const clickOrDragGames = (e, index) => {
    const mouseUp = e.clientX;
    if (
      mouseUp < window.checkForDrag + 5 &&
      mouseUp > window.checkForDrag - 5
    ) {
      if (!OverAStar) {
        GamesPressed(index, false);
      }
    }
  };

  const mouseDownCoordsGamesTop = (e) => {
    window.checkForDrag = e.clientX;
  };

  const clickOrDragGamesTop = (e, index) => {
    const mouseUp = e.clientX;
    if (
      mouseUp < window.checkForDrag + 5 &&
      mouseUp > window.checkForDrag - 5
    ) {
      GamesPressed(index, true);
    }
  };

  function changeFavoritesStatus(game_id, mutationValue) {
    let the_favorites = [...TheFavoritesIds];

    if (mutationValue) {
      the_favorites.push(game_id);
    } else {
      const index = the_favorites.indexOf(game_id);
      the_favorites.splice(index, 1);
    }

    set_Favorite_Game({
      variables: {
        id: data_user.users[0].id,
        favorite_game_ids: the_favorites,
      },
    });

    setTheFavoritesIds(the_favorites);
  }

  const GamesPressed = async (index, is_from_top) => {
    let the_game;
    if (is_from_top) {
      the_game = TopGamesShown[index];
    } else {
      the_game = GamesToShow[index];
    }

    const tmp_result = await returnTheLink(
      the_game.provider,
      the_game.title,
      data_user.users[0].gp_user_id,
      languages_queue_names[TheLanguageIndex],
      the_game.provider === "grgames"? My_website + "/exit.html" : My_website
    );

    if(tmp_result === "error"){
      return;
    }

    if (window.innerWidth < window.innerHeight && window.innerWidth > 600) {
      setHalfScreen(true);
    } else {
      setHalfScreen(false);
    }

    setGameStarted(true);

    setTheSpecificGameCategory(the_game.category.toLowerCase());

    setActivateExit(the_game.exit_button);

    setFrameUrl(tmp_result);

    if (IsMobile) {
      openFullscreen(document.documentElement);
    }

    StoreInLocalStorage(KeepLobbyIndex);

    stopSound();
    setAudioPlaying(false);

    set_Current_Game({
      variables: {
        id: data_user.users[0].id,
        current_game: the_game.title,
      },
    });
  };

  const GamePressedAviator = (keep_index) => {
    setGameStarted(true);
    if (IsMobile) {
      openFullscreen(document.documentElement);
    }
    setAviatorStarted(true);
    let currentUrl = process.env.REACT_APP_AVIATOR_WEBSITE;
    const updatedUrl = `${currentUrl}?token=${locToken}`;

    setAviatorStartedWebsite(updatedUrl);

    StoreInLocalStorage(keep_index);
    stopSound();
    setAudioPlaying(false);

    set_Current_Game({
      variables: {
        id: data_user.users[0].id,
        current_game: "aviator",
      },
    });
  };

  const StoreInLocalStorage = (keep_index = KeepLobbyIndex) => {
    localStorage.setItem("GamesToShowAllSlides", GamesToShowAllSlides);
    localStorage.setItem("GamesToShowCurrentSlide", GamesToShowCurrentSlide);
    localStorage.setItem("SlidesToShowGames", SlidesToShowGames);
    localStorage.setItem("KeepLobbyIndex", keep_index);
    localStorage.setItem("ProviderIndex", ProviderIndex);
    localStorage.setItem("TheLanguageIndex", TheLanguageIndex);
    localStorage.setItem("ShowLobby", ShowLobby);
  };

  return (
    <>
      {!DarkMode ? (
        <>
          {TheShopLogo !== "---" && (
            <div
              className="shop_logo"
              style={{
                backgroundImage: `url(${TheShopLogo.replace(/ /g, "%20")})`,
              }}
            ></div>
          )}
          {LoginScreen ? (
            <div id="login" className="content content-active">
              <div className="spin-logo no-authorize hr"
              ></div>
              <div className="formContainer">
                <label>
                  <div className="inputContainer inputContainerLogin">
                    <div className="coins"></div>
                    <input
                      type="text"
                      name="uniqueNameXYZ_us"
                      id="login_input"
                      className="input inputLogin"
                      placeholder="Login"
                      autoComplete="new-password"
                      // value={Username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => {
                        login_username_focus = true;
                      }}
                    />
                  </div>
                </label>
                <label>
                  <div className="inputContainer inputContainerPassword">
                    <input
                      type="password"
                      name="uniqueNameXYZ"
                      id="password_input"
                      className="input inputPassword"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => {
                        login_username_focus = false;
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          signin(
                            String(Username).toLowerCase(),
                            String(Password)
                          );
                        }
                      }}
                    />
                  </div>
                </label>
                <div className="keyboard-wrap">
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 1);
                      } else {
                        setPassword(Password + 1);
                      }
                    }}
                  >
                    <p>1</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 2);
                      } else {
                        setPassword(Password + 2);
                      }
                    }}
                  >
                    <p>2</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 3);
                      } else {
                        setPassword(Password + 3);
                      }
                    }}
                  >
                    <p>3</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 4);
                      } else {
                        setPassword(Password + 4);
                      }
                    }}
                  >
                    <p>4</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 5);
                      } else {
                        setPassword(Password + 5);
                      }
                    }}
                  >
                    <p>5</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 6);
                      } else {
                        setPassword(Password + 6);
                      }
                    }}
                  >
                    <p>6</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 7);
                      } else {
                        setPassword(Password + 7);
                      }
                    }}
                  >
                    <p>7</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 8);
                      } else {
                        setPassword(Password + 8);
                      }
                    }}
                  >
                    <p>8</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 9);
                      } else {
                        setPassword(Password + 9);
                      }
                    }}
                  >
                    <p>9</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-clear"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username.slice(0, -1));
                      } else {
                        setPassword(Password.slice(0, -1));
                      }
                    }}
                  >
                    <p>&lt;</p>
                  </button>
                  <button
                    className="keyboard-button keyboard-button-number"
                    type="button"
                    onClick={() => {
                      if (login_username_focus) {
                        setUsername(Username + 0);
                      } else {
                        setPassword(Password + 0);
                      }
                    }}
                  >
                    <p>0</p>{" "}
                  </button>
                  <button
                    className="keyboard-button keyboard-button-ok"
                    type="submit"
                    onClick={() => {
                      signin(String(Username).toLowerCase(), String(Password));
                    }}
                  >
                    <p>OK</p>{" "}
                  </button>
                </div>
                <div className="submitButtonContainer">
                  <button
                    className="submitButton"
                    onClick={() => {
                      signin(String(Username).toLowerCase(), String(Password));
                    }}
                  >
                    <span>Log in</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <>
                {LoadingReady && LoadingReady2 && LoadingReady3 ? (
                  <>
                    {(!GameStarted || HalfScreen) && (
                      <div className="App">
                        <div className="App-header">
                          <div className="head">
                            {EnableButtonFullScreen && (
                              <div
                                className="head_button head_button--screen"
                                onClick={() => {
                                  if (isFullScreen) {
                                    isFullScreen = false;
                                    closeFullscreen();
                                  } else {
                                    openFullscreen(document.documentElement);
                                  }
                                }}
                                style={{ display: "block" }}
                              ></div>
                            )}
                            {AudioPlaying
                              ? EnableButtonMute && (
                                <div
                                className="head_button head_button--sound active"
                                onClick={() => {
                                  stopSound();
                                }}
                              ></div>
                            )
                          : EnableButtonMute && (
                              <div
                                className="head_button head_button--sound"
                                onClick={() => {
                                  playSound();
                                }}
                              ></div>
                            )}
                        
                          <div
                            className="dropdown-languages"
                            onClick={() => {
                              setDropdownActive(!DropdownActive);
                            }}
                            onMouseLeave={() => {
                              setDropdownActive(false);
                            }}
                            style={{ height: "fit-content" }}
                          >
                            {imagesLanguages.map((lang, i) => (
                              <div
                                key={i}
                                className={theClassName(i, DropdownActive)}
                                onClick={() => {
                                  setTheLanguageIndex(i);
                                }}
                              >
                              </div>
                                ))}

                                <span className="arrow-for-open"></span>
                              </div>
                            </div>

                          <div width="100%">
                            {data_user ? (
                              <div className="balance-and-bonuse" >
                                <div className="credits_container">                                  
                                <div className="credits_balance">
                                  <div
                                    className="head_button_value" width="50%"
                                    data-text={
                                      (
                                        data_user.users[0].credits / 100
                                      ).toFixed(2) + TheCurrency
                                    }
                                  >
                                    {(data_user.users[0].credits / 100).toFixed(
                                      2
                                    ) + TheCurrency}
                                  </div> 
                                </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <div className="spin-logo hr"></div>

                          {ShowLobby ? (
                            <div
                              className="providers_slider active"
                              style={{
                                display:
                                  HalfScreen && GameStarted ? "none" : "",
                              }}
                            >
                              <div className="provider-arrows">
                                <div
                                  onClick={() => {
                                    previous();
                                  }}
                                  className="provider-arrow-left slick-arrow"
                                  style={{ display: "inline-block" }}
                                ></div>
                                <div
                                  onClick={() => {
                                    next();
                                  }}
                                  className="provider-arrow-right slick-arrow"
                                  style={{ display: "inline-block" }}
                                ></div>
                              </div>

                              <Slider
                                ref={sliderRef}
                                {...settings}
                                className="providers providers_list"
                                initialSlide={KeepLobbyIndex}
                              >
                                {TheGamesCategoriesImages.map((image, i) => (
                                  <div
                                    onMouseDown={(e) => {
                                      mouseDownCoords(e, i);
                                    }}
                                    onMouseUp={(e) => clickOrDrag(e, i)}
                                    key={i}
                                    className="provider-wrap"
                                    style={{
                                      width: "100%",

                                      display: "inline-block",
                                    }}
                                  >
                                    <div
                                      provider={
                                        image === ""
                                          ? TheGamesCategories[0].toLowerCase()
                                          : TheGamesCategories[i].toLowerCase()
                                      }
                                      className="provider"
                                      style={{
                                        backgroundImage: `url(${
                                          image === ""
                                            ? default_image
                                            : image
                                        })`,
                                      }}
                                    />
                                  </div>
                                ))}
                              </Slider>
                            </div>
                          ) : (
                            <div
                              className="games_slider active"
                              style={{
                                display:
                                  HalfScreen && GameStarted ? "none" : "",
                              }}
                            >
                              <div className="games" style={{ height: "100%" }}>
                                {/* eslint-disable-next-line */}
                                <a
                                  className="game_control game_control--left slick-arrow"
                                  id="scroll_left"
                                  onClick={() => {
                                    previousGames();
                                  }}
                                  style={{ display: "block" }}
                                ></a>
                                {/* eslint-disable-next-line */}
                                <a
                                  className="game_control game_control--right slick-arrow"
                                  id="scroll_right"
                                  onClick={() => {
                                    nextGames();
                                  }}
                                  style={{ display: "block" }}
                                ></a>
                                <Slider
                                  ref={sliderGamesRef}
                                  {...settingsGames}
                                  className="games_inner"
                                  initialSlide={GamesToShowCurrentSlide - 1}
                                  afterChange={(index) =>
                                    setGamesToShowCurrentSlide(index + 1)
                                  }
                                >
                                  {GamesToShow.map((games, i) => (
                                    <div
                                      onMouseDown={(e) => {
                                        mouseDownCoordsGames(e, i);
                                      }}
                                      onMouseUp={(e) => clickOrDragGames(e, i)}
                                      className="game loading"
                                      provider={games.category}
                                      key={i}
                                    >
                                      <div
                                        className="game-img loaded"
                                        style={{
                                          backgroundImage: `url(${games.image.replace(
                                            / /g,
                                            "%20"
                                          )})`,
                                        }}
                                      >
                                        {TheFavoritesIds.includes(games.id) ? (
                                          <div
                                            className="star active"
                                            onMouseEnter={() =>
                                              setOverAStar(true)
                                            }
                                            onMouseLeave={() =>
                                              setOverAStar(false)
                                            }
                                            onClick={() => {
                                              changeFavoritesStatus(
                                                games.id,
                                                false
                                              );
                                            }}
                                          ></div>
                                        ) : (
                                          <div
                                            className="star"
                                            onMouseEnter={() =>
                                              setOverAStar(true)
                                            }
                                            onMouseLeave={() =>
                                              setOverAStar(false)
                                            }
                                            onClick={() => {
                                              changeFavoritesStatus(
                                                games.id,
                                                true
                                              );
                                            }}
                                          ></div>
                                        )}
                                      </div>

                                      <div className="game_open"></div>
                                    </div>
                                  ))}
                                </Slider>
                                <div
                                  style={{ height: "auto" }}
                                  className="page-number"
                                >
                                  <span
                                    className="current-page"
                                    data-text={GamesToShowCurrentSlide}
                                  >
                                    {GamesToShowCurrentSlide}
                                  </span>
                                  <span data-text="/">/</span>
                                  <span
                                    className="total-page"
                                    data-text={GamesToShowAllSlides}
                                  >
                                    {GamesToShowAllSlides}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className=
                            "tablets hr">
                            
                            <div className="lady"></div>
                            <div className="glass_jackbg"></div>
                            <div className="jack-top"></div>
                            

                            {TheJackpotValues.filter(
                              (obj) => obj.value !== "0.00"
                            ).map((jackpot, i) => (
                              <React.Fragment key={i}>
               
                                  <div
                                    className=""
                                    id={"hr_order" + i
                                    }
                                    key={i}
                                  >
                                    <div
                                      className={"value active hr"
                                      }
                                      id={"value_active_jackpot_order" + i}
                                      name={jackpot.name}
                                    >
                                      <div className={"odometer-digits hr"
                                    }>
                                        {jackpot.value}
                                      </div>
                                    </div>
                                  </div>
                                  
                                
                              </React.Fragment>
                            ))}

                          </div>

                          <div
                            className="top"
                            style={
                              ShowTopCategory === null
                                ? {
                                    display: "none",
                                  }
                                : {
                                    display: "block",
                                  }
                            }
                          >
                            <Slider
                              ref={sliderRefTop}
                              {...settingsTop}
                              className="top-games"
                              initialSlide={0}
                            >
                              {TopGamesShown.map((games, i) => (
                                // eslint-disable-next-line
                                <a
                                  key={i}
                                  style={{
                                    width: "100%",
                                    display: "inline-block",
                                  }}
                                >
                                  <div
                                    className="game-img"
                                    onMouseDown={(e) => {
                                      mouseDownCoordsGamesTop(e, i);
                                    }}
                                    onMouseUp={(e) => clickOrDragGamesTop(e, i)}
                                    style={{
                                      backgroundImage: `url(${games.image})`,
                                      backgroundSize: "100% 100%",
                                    }}
                                  ></div>
                                </a>
                              ))}
                            </Slider>
                          </div>

                          <div
                            className="wheel-button"
                            href="link.html"
                            target="iframe1"
                          ></div>
                          <div className="footer_linee"></div>

                          <div className="footer">
                            <div className="footer-left">
                              {/* eslint-disable-next-line */}
                              <a
                                onClick={() => {
                                  if (ShowTopCategory === "new") {
                                    setShowTopCategory(null);
                                  } else {
                                    setShowTopCategory("new");
                                    setTopGamesShown(TheNewGames);
                                  }
                                }}
                                className={
                                  ShowTopCategory === "new"
                                    ? "footer_link active footer_link--new"
                                    : "footer_link footer_link--new"
                                }
                              >
                                <span className="link-icon"></span>
                                <span
                                  className="link-name"
                                  data-text={ReturnTheRightText("New")}
                                >
                                  {ReturnTheRightText("New")}
                                </span>
                              </a>

                              {/* eslint-disable-next-line */}
                              <a
                                onClick={() => {
                                  if (ShowTopCategory === "top") {
                                    setShowTopCategory(null);
                                  } else {
                                    setShowTopCategory("top");
                                    setTopGamesShown(TheTopGames);
                                  }
                                }}
                                className={
                                  ShowTopCategory === "top"
                                    ? "footer_link active footer_link--top"
                                    : "footer_link footer_link--top"
                                }
                              >
                                <span className="link-icon"></span>
                                <span
                                  className="link-name"
                                  data-text={ReturnTheRightText("Top")}
                                >
                                  {ReturnTheRightText("Top")}
                                </span>
                              </a>
                              {/* eslint-disable-next-line */}
                              <a
                                onClick={() => {
                                  if (ShowTopCategory === "fav") {
                                    setShowTopCategory(null);
                                  } else {
                                    setShowTopCategory("fav");
                                    setTopGamesShown(TheFavorites);
                                  }
                                }}
                                className={
                                  ShowTopCategory === "fav"
                                    ? "footer_link active footer_link--favourite"
                                    : "footer_link footer_link--favourite"
                                }
                              >
                                <span className="link-icon"></span>
                                <span
                                  className="link-name"
                                  data-text={ReturnTheRightText("Favorites")}
                                >
                                  {ReturnTheRightText("Favorites")}
                                </span>
                              </a>

                              {InfoActive ? (
                                <div
                                  className="footer_link footer_link--info core-bonuses-info active"
                                  data-text={ReturnTheRightText("INFO")}
                                >
                                  <span className="link-icon"></span>

                                  <span
                                    className="link-name"
                                    data-text={ReturnTheRightText("INFO")}
                                  >
                                    {ReturnTheRightText("INFO")}
                                  </span>

                                  <section>
                                    <span
                                      className="bonuses-button"
                                      onClick={() => {
                                        setInfoActive(!InfoActive);
                                      }}
                                    ></span>
                                    <div className="pop-up bonuses">
                                      <div className="bonuses-wrap">
                                        <div bonus="cashback">
                                          <div className="main">
                                            <p line="amount">
                                              <b>
                                                {ReturnTheRightText("Cashback")}
                                                :
                                              </b>
                                              <span> 0.00</span>
                                            </p>
                                          </div>
                                          <p
                                            className="info-link"
                                            onClick={() => {
                                              setInfoActiveCashback(
                                                !InfoActiveCashback
                                              );
                                            }}
                                          >
                                            ?
                                          </p>

                                          {InfoActiveCashback ? (
                                            <div className="additional active">
                                              <p line="info">
                                                <b>
                                                  {ReturnTheRightText(
                                                    "Cashback"
                                                  )}
                                                  :{" "}
                                                </b>
                                                <span>
                                                  {ReturnTheRightText(
                                                    "YouWill"
                                                  )}
                                                </span>
                                              </p>
                                            </div>
                                          ) : (
                                            <div className="additional">
                                              <p line="info">
                                                <b>
                                                  {ReturnTheRightText(
                                                    "Cashback"
                                                  )}
                                                  :{" "}
                                                </b>
                                                <span>
                                                  {ReturnTheRightText(
                                                    "YouWill"
                                                  )}
                                                </span>
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        <hr bonushr="cashback" />
                                        <div bonus="wheel">
                                          <div className="main">
                                            <p line="info">
                                              <span>
                                                {ReturnTheRightText("IfYou")}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </section>
                                </div>
                              ) : (
                                <div
                                  className="footer_link footer_link--info core-bonuses-info"
                                  data-text={ReturnTheRightText("INFO")}
                                >
                                  <span className="link-icon"></span>

                                  <span
                                    className="link-name"
                                    data-text={ReturnTheRightText("INFO")}
                                  >
                                    {ReturnTheRightText("INFO")}
                                  </span>

                                  <section>
                                    <span
                                      className="bonuses-button"
                                      onClick={() => {
                                        setInfoActive(!InfoActive);
                                      }}
                                    ></span>
                                    <div className="pop-up bonuses">
                                      <div className="bonuses-wrap">
                                        <div bonus="cashback">
                                          <div className="main">
                                            <p line="amount">
                                              <b>
                                                {ReturnTheRightText("Cashback")}
                                                :{" "}
                                              </b>
                                              <span> 0.00</span>
                                            </p>
                                          </div>
                                          <p
                                            className="info-link"
                                            onClick={() => {
                                              setInfoActiveCashback(
                                                !InfoActiveCashback
                                              );
                                            }}
                                          >
                                            ?
                                          </p>
                                          {InfoActiveCashback ? (
                                            <div className="additional active">
                                              <p line="info">
                                                <b>
                                                  {ReturnTheRightText(
                                                    "Cashback"
                                                  )}
                                                  :{" "}
                                                </b>
                                                <span>
                                                  {ReturnTheRightText(
                                                    "YouWill"
                                                  )}
                                                </span>
                                              </p>
                                            </div>
                                          ) : (
                                            <div className="additional">
                                              <p line="info">
                                                <b>
                                                  {ReturnTheRightText(
                                                    "Cashback"
                                                  )}
                                                  :{" "}
                                                </b>
                                                <span>
                                                  {ReturnTheRightText(
                                                    "YouWill"
                                                  )}
                                                </span>
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        <hr bonushr="cashback" />
                                        <div bonus="wheel">
                                          <div className="main">
                                            <p line="info">
                                              <span>
                                                {ReturnTheRightText("IfYou")}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </section>
                                </div>
                              )}
                            </div>

                            {/* eslint-disable-next-line */}
                            <a
                              className="footer-menu"
                              onClick={() => {
                                setShowLobby(true);
                                setGamesToShow([]);
                              }}
                            >
                              <span
                                className="footer-menu-text"
                                data-text={ReturnTheRightText("menu")}
                              >
                                {ReturnTheRightText("menu")}
                              </span>
                            </a>

                            <div className="footer-right">
                              {data_user ? (
                                <div className="footer_link footer_link--id">
                                  <span className="text-id" data-text="id">
                                    id:
                                  </span>
                                  <span
                                    className="id-value"
                                    data-text={data_user.users[0].id}
                                  >
                                    {data_user.users[0].id}
                                  </span>
                                </div>
                              ) : null}
                              {EnableButtonLogout && (
                                // eslint-disable-next-line
                                <a
                                  onClick={() => {
                                    logOut();
                                  }}
                                  className="footer_link footer_link--logout visible"
                                  data-text={ReturnTheRightText("exit")}
                                  style={{ display: "inline" }}
                                >
                                  <span
                                    className="link-name"
                                    data-text={ReturnTheRightText("exit")}
                                  >
                                    {ReturnTheRightText("exit")}
                                  </span>
                                  <span className="link-icon"></span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {JackpotActivated ? (
                      <div
                        className={
                          JackpotLandscape
                            ? "jackpot-win resize landscape-orientation active"
                            : "jackpot-win resize portrait-orientation active"
                        }
                        style={
                          JackpotLandscape
                            ? {
                                height: "1080px",
                                width: "1920px",
                                transform:
                                  "scale(" +
                                  TransformJackpotVertical +
                                  ", " +
                                  TransformJackpotHorizontal +
                                  ")",
                              }
                            : {
                                height: "1920px",
                                width: "1080px",
                                transform:
                                  "scale(" +
                                  TransformJackpotVertical +
                                  ", " +
                                  TransformJackpotHorizontal +
                                  ")",
                              }
                        }
                      >
                        <div className="jackpot-block">
                          <div className="jackpot-seq">
                            <div className="login_coins"></div>
                            <div
                              className="login_coins"
                              style={{
                                width: "80%",
                                height: "80%",
                                left: "10%",
                              }}
                            ></div>
                            <div
                              className="login_coins"
                              style={{
                                width: "50%",
                                height: "50%",
                                top: "0%",
                              }}
                            ></div>
                            <div
                              className="login_coins"
                              style={{
                                width: "70%",
                                height: "70%",
                                top: "50%",
                                left: "20%",
                              }}
                            ></div>
                            <div
                              className="login_coins"
                              style={{
                                width: "70%",
                                height: "70%",
                                top: "-25%",
                                right: "-30%",
                                left: "unset",
                              }}
                            ></div>
                            <div
                              className="login_coins"
                              style={{
                                width: "55%",
                                height: "65%",
                                top: "-5%",
                                right: "-15%",
                                left: "unset",
                                rotate: "120deg",
                              }}
                            ></div>
                            <div
                              className="login_coins"
                              style={{
                                width: "55%",
                                height: "65%",
                                top: "50%",
                                left: "-15%",
                                right: "unset",
                                rotate: "-120deg",
                              }}
                            ></div>
                          </div>
                          <div className="jackpot-amount">
                            <span
                              className="jackpot-value"
                              data-text={TheJackpotWinnerValue}
                              // data-text={"100.00"+TheCurrency}
                            >
                              {TheJackpotWinnerValue}
                              {/* {"100.00"+TheCurrency} */}
                            </span>
                          </div>
                          <div
                            className="jackpot-close"
                            onClick={() => {
                              setJackpotActivated(false);
                              set_Enable_Gaming({
                                variables: {
                                  id: data_user.users[0].id,
                                },
                              });
                            }}
                          ></div>
                          <div className="jackpot-label">
                            <span
                              className="jackpot-value"
                              style={{
                                fontSize: "50px",
                              }}
                              data-text={TheJackpotWinnerLevel}
                              // data-text={"DIAMOND"}
                            >
                              {TheJackpotWinnerLevel}
                              {/* {"DIAMOND"} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {MessageActivated ? (
                      <div className="user-attention active">
                        <div
                          className="close-button"
                          onClick={() => {
                            setMessageActivated(false);
                          }}
                        >
                          X
                        </div>
                        <div className="messages">
                          <div className="main">
                            User {TheJackpotWinnerUser} won the
                          </div>
                          <div className="main">
                            {TheJackpotWinnerLevel} Jackpot{" "}
                          </div>
                          <div className="main">{TheJackpotWinnerValue} </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="preloader active" id="preloader">
                      <div id="loader"></div>
                      <span>
                        {
                          <CountUp
                            start={0}
                            end={100}
                            duration={1}
                            decimals={0}
                            onEnd={() => {
                              setLoadingReady(true);
                            }}
                          />
                        }
                      </span>
                      %
                    </div>
                  </>
                )}
              </>
              {GameStarted && (
                <>
                  {!TheWheelOfFortuneActivation ? (
                    <>
                      <div
                        id="launcher"
                        className="content jackpot-active content-active"
                        style={
                          HalfScreen
                            ? {
                                top: "54.5%",
                                width: "100%",
                                position: "absolute",
                              }
                            : null
                        }
                      >
                        {!AviatorStarted && !HalfScreen && (
                          <div className="launcher-menu">
                            <div className="launcher-jackpots">
                              {[...TheJackpotValues]
                                .reverse()
                                .slice(0, TheJackpotValues.length / 2)
                                .map((jackpot, i) => (
                                  <React.Fragment key={i}>
                                    {jackpot.value !== "0.00" &&
                                    jackpot.name.toLowerCase() !== "grand" ? (
                                      <div
                                        className={
                                          "launcher-jackpot " +
                                          jackpot.name.toLowerCase()
                                        }
                                      >
                                        <span className="name">
                                          {jackpot.name}
                                        </span>
                                        <span
                                          name={jackpot.name.toLowerCase()}
                                          className="value active"
                                        >
                                          <div
                                            className="odometer-digits"
                                            style={{ display: "flex" }}
                                          >
                                            <div className="odometer-digit">
                                              {jackpot.value}
                                            </div>
                                          </div>
                                        </span>
                                      </div>
                                    ) : null}
                                  </React.Fragment>
                                ))}

                              {TheJackpotValues[0].value !== "0.00" && (
                                <div
                                  className={
                                    "launcher-jackpot red " +
                                    TheJackpotValues[0].name.toLowerCase()
                                  }
                                >
                                  <span className="name">
                                    {TheJackpotValues[0].name}
                                  </span>
                                  <span
                                    name={TheJackpotValues[0].name.toLowerCase()}
                                    className="value active"
                                  >
                                    <div
                                      className="odometer-digits"
                                      style={{ display: "flex" }}
                                    >
                                      <div className="odometer-digit">
                                        {TheJackpotValues[0].value}
                                      </div>
                                    </div>
                                  </span>
                                </div>
                              )}

                              {[...TheJackpotValues]
                                .reverse()
                                .slice(
                                  TheJackpotValues.length / 2,
                                  TheJackpotValues.length
                                )
                                .map((jackpot, i) => (
                                  <React.Fragment key={i}>
                                    {jackpot.value !== "0.00" &&
                                    jackpot.name.toLowerCase() !== "grand" ? (
                                      <div
                                        className={
                                          "launcher-jackpot " +
                                          jackpot.name.toLowerCase()
                                        }
                                      >
                                        <span className="name">
                                          {jackpot.name}
                                        </span>
                                        <span
                                          name={jackpot.name.toLowerCase()}
                                          className="value active"
                                        >
                                          <div
                                            className="odometer-digits"
                                            style={{ display: "flex" }}
                                          >
                                            <div className="odometer-digit">
                                              {jackpot.value}
                                            </div>
                                          </div>
                                        </span>
                                      </div>
                                    ) : null}
                                  </React.Fragment>
                                ))}
                            </div>
                          </div>
                        )}

                        <div
                          className={
                            AviatorStarted
                              ? "launcher-game-block aviator"
                              : "launcher-game-block"
                          }
                          style={{ height: HalfScreen ? "100%" : "" }}
                        >
                          <div className="launcher-game">
                            {/* eslint-disable-next-line */}
                            <iframe
                              id="the_game_iframe"
                              // title="game_frame"
                              src={
                                AviatorStarted
                                  ? AviatorStartedWebsite
                                  : FrameUrl
                              }
                              style={
                                HalfScreen
                                  ? {
                                      border: 0,
                                      width: "100%",
                                      height: "45.5%",
                                    }
                                  : {
                                      border: 0,
                                      width: "100%",
                                      height: "100%",
                                      zIndex: "9",
                                    }
                              }
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {((Novomatic_big_Exit &&
                    TheSpecificGameCategory === "novomatic") ||
                    AviatorStarted || ActivateExit) && (
                    <button
                      className={
                        AviatorStarted
                          ? "NovomaticButtonBigExit Aviator"
                          : "NovomaticButtonBigExit"
                      }
                      style={{
                        top: HalfScreen ? "58%" : null,
                      }}
                      onClick={() => {
                        //window.location.href = My_website;
                        window.removeGame();
                      }}
                    >
                      <span>EXIT</span>
                    </button>
                  )}
                  {JackpotActivated ? (
                    <div
                      className={
                        JackpotLandscape
                          ? "jackpot-win resize landscape-orientation active"
                          : "jackpot-win resize portrait-orientation active"
                      }
                      style={
                        JackpotLandscape
                          ? {
                              height: "1080px",
                              width: "1920px",
                              transform:
                                "scale(" +
                                TransformJackpotVertical +
                                ", " +
                                TransformJackpotHorizontal +
                                ")",
                            }
                          : {
                              height: "1920px",
                              width: "1080px",
                              transform:
                                "scale(" +
                                TransformJackpotVertical +
                                ", " +
                                TransformJackpotHorizontal +
                                ")",
                            }
                      }
                    >
                      <div className="jackpot-block">
                        <div className="jackpot-seq">
                          <div className="login_coins"></div>
                          <div
                            className="login_coins"
                            style={{
                              width: "80%",
                              height: "80%",
                              left: "10%",
                            }}
                          ></div>
                          <div
                            className="login_coins"
                            style={{
                              width: "50%",
                              height: "50%",
                              top: "0%",
                            }}
                          ></div>
                          <div
                            className="login_coins"
                            style={{
                              width: "70%",
                              height: "70%",
                              top: "50%",
                              left: "20%",
                            }}
                          ></div>
                          <div
                            className="login_coins"
                            style={{
                              width: "70%",
                              height: "70%",
                              top: "-25%",
                              right: "-30%",
                              left: "unset",
                            }}
                          ></div>
                          <div
                            className="login_coins"
                            style={{
                              width: "55%",
                              height: "65%",
                              top: "-5%",
                              right: "-15%",
                              left: "unset",
                              rotate: "120deg",
                            }}
                          ></div>
                          <div
                            className="login_coins"
                            style={{
                              width: "55%",
                              height: "65%",
                              top: "50%",
                              left: "-15%",
                              right: "unset",
                              rotate: "-120deg",
                            }}
                          ></div>
                        </div>
                        <div className="jackpot-amount">
                          <span
                            className="jackpot-value"
                            data-text={TheJackpotWinnerValue}
                          >
                            {TheJackpotWinnerValue}
                          </span>
                        </div>
                        <div
                          className="jackpot-close"
                          onClick={() => {
                            setJackpotActivated(false);
                            set_Enable_Gaming({
                              variables: {
                                id: data_user.users[0].id,
                              },
                            });
                          }}
                        ></div>
                        <div className="jackpot-label">
                          <span
                            className="jackpot-value"
                            style={{
                              fontSize: "50px",
                            }}
                            data-text={TheJackpotWinnerLevel}
                          >
                            {TheJackpotWinnerLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {MessageActivated ? (
                    <div className="user-attention active">
                      <div
                        className="close-button"
                        onClick={() => {
                          setMessageActivated(false);
                        }}
                      >
                        X
                      </div>
                      <div className="messages">
                        <div className="main">User </div>
                        <div className="main">{TheJackpotWinnerUser}</div>
                        <div className="main">won the </div>
                        <div className="main">
                          {TheJackpotWinnerLevel} Jackpot{" "}
                        </div>
                        <div className="main">{TheJackpotWinnerValue} </div>
                      </div>
                    </div>
                  ) : null}

                  {TheWheelOfFortuneActivation ? (
                    <div
                      className="user-attention active bing"
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        backgroundColor: "#000000",
                      }}
                    >
                      <div
                        className="messages"
                        style={{
                          paddingLeft: "inherit",
                          margin: "inherit",
                          listStyle: "inherit",
                          overflow: "inherit",
                          display: "inherit",
                          flexDirection: "inherit",
                          justifyContent: "inherit",
                          height: "auto",
                        }}
                      >
                        <div className="main">
                          Wheel of Fortune to Multiply Bonus
                        </div>
                      </div>
                      <div className="login_coins"></div>
                      <div
                        className="login_coins"
                        style={{
                          width: "80%",
                          height: "80%",
                          left: "10%",
                        }}
                      ></div>
                      <div
                        className="login_coins"
                        style={{
                          width: "50%",
                          height: "50%",
                          top: "0%",
                        }}
                      ></div>
                      <div
                        className="login_coins"
                        style={{
                          width: "70%",
                          height: "70%",
                          top: "50%",
                          left: "20%",
                        }}
                      ></div>
                      <div
                        className="login_coins"
                        style={{
                          width: "70%",
                          height: "70%",
                          top: "-25%",
                          right: "-30%",
                          left: "unset",
                        }}
                      ></div>
                      <div
                        className="login_coins"
                        style={{
                          width: "55%",
                          height: "65%",
                          top: "-5%",
                          right: "-15%",
                          left: "unset",
                          rotate: "120deg",
                        }}
                      ></div>
                      <div
                        className="login_coins"
                        style={{
                          width: "55%",
                          height: "65%",
                          top: "50%",
                          left: "-15%",
                          right: "unset",
                          rotate: "-120deg",
                        }}
                      ></div>
                      {RevealX && (
                        <div
                          className="close-button"
                          onClick={() => {
                            setTheWheelOfFortuneActivation(false);
                            setRevealX(false);
                            setStartSpin(true);
                          }}
                        >
                          X
                        </div>
                      )}
                      {RevealX && (
                        <div className="won">
                          <h2 className="text_shadows">
                            {" "}
                            You won {TheWheelOfFortuneValue}
                            {TheCurrency}
                          </h2>
                        </div>
                      )}
                      {RevealX && (
                        <div className="wonLights">
                          <img
                            src={lightsOnly}
                            height="100%"
                            width="100%"
                            alt="rotating sun"
                          />
                        </div>
                      )}
                      <div
                        className="wheel_position theCircles_only"
                        onClick={() => {
                          if (!StartSpin) {
                            setStartSpin(true);
                            playSoundSpinning();
                          }
                        }}
                        style={{ cursor: !StartSpin ? "pointer" : "default" }}
                      >
                        <img
                          src={img_circles_only}
                          height="100%"
                          width="100%"
                          alt="rotating sun"
                        />
                      </div>
                      {StartSpin ? (
                        <div
                          id="the_spinning_wheel"
                          className={
                            StartSpin
                              ? "wheel_position theWheel_only"
                              : "wheel_position theWheel_only_no_spin"
                          }
                        >
                          <img
                            src={img_wheel_only}
                            height="100%"
                            width="100%"
                            alt="rotating sun"
                          />
                        </div>
                      ) : (
                        <div
                          id="the_spinning_wheel"
                          className={
                            StartSpin
                              ? "wheel_position theWheel_only"
                              : "wheel_position theWheel_only_no_spin"
                          }
                        >
                          <img
                            src={img_wheel_only_lights}
                            height="100%"
                            width="100%"
                            alt="rotating sun"
                          />
                        </div>
                      )}

                      {RevealX && (
                        <div
                          className="messages"
                          style={{
                            paddingLeft: "inherit",
                            // margin: "unset",
                            listStyle: "inherit",
                            overflow: "inherit",
                            display: "inherit",
                            flexDirection: "initial",
                            justifyContent: "inherit",
                            height: "auto",
                          }}
                        ></div>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </>
      ) : null}
    </>
  );
};

export default ThePage;
// JavaScript Document