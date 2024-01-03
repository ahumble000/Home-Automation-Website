let hide_seen_pass = document.getElementsByClassName('fa-solid')[0];
let password = document.getElementById('password');

hide_seen_pass.addEventListener('click',()=>{
    if(password.type == 'password'){
        password.type = 'text';
        hide_seen_pass.classList.remove('fa-eye');
        hide_seen_pass.classList.add('fa-eye-slash');
    }
    else{
        password.type = 'password';
        hide_seen_pass.classList.remove('fa-eye-slash');
        hide_seen_pass.classList.add('fa-eye');
    }
});

const updateTimeAndDate = ()=> {
    let time = document.getElementsByClassName('time')[0];
    let dateChange = document.getElementsByClassName('date')[0];

    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let day = now.toLocaleDateString('en-US', { weekday: 'long' });
    let date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    let timeString = hours + ' : ' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;

    time.textContent = timeString;
    dateChange.textContent = day + ' | ' + date;
}

setInterval(updateTimeAndDate, 1000);

const toggleText = document.getElementsByClassName('toggleText');

for(let i=0;i<7;i++){
        document.getElementsByClassName('toggleSwitch')[i].addEventListener('change', function () {
            toggleText[i].textContent = this.checked ? 'On' : 'Off';
        });
}


