export default class ARI
{
    #PI2; // 2*Pi (для облегчения записи)
    #canvas; // Холст
    #context; // Контекст холста
    #CirclesCenterX; #CirclesCenterY; // координаты центра окружностей
    #LineColor; #TextColor // цвета линий и текста
    #pixelSpace; // расстояние между окружностями в пикселях
    #scaleNumber; // номер масштаба
    #maximized; // булева переменная для обозначения, увеличен ли холст
    #distanceX; #distanceY // положение мышки для перемещения карты
    #CanvasCenter; // центр холста
    #interScale // булева переменная для обозначения промежуточного масштабирования

    // создаём объект в уменьшенном виде
    constructor()
    {
        this.#canvas = document.getElementById('ARI-item');
        if (this.#canvas != null){
            this.#canvas.width = 450
            this.#canvas.height = 450
            this.#context = this.#canvas.getContext('2d')
            this.#LineColor = 'lightgreen';
            this.#TextColor = 'yellowgreen';
            this.#PI2 = Math.PI * 2;
            this.#CirclesCenterX = this.#CirclesCenterY = this.#canvas.width / 2;
            this.#CanvasCenter = this.#canvas.height / 2;
            this.#pixelSpace = 50;
            this.#scaleNumber = 1;
            this.#context.lineWidth = 1;
            this.#maximized = false;
            this.#context.font = '11px mono'
            this.#interScale = true
        }
    }

    // метод для отрисовки
    Draw()
    {
        let angle, radius, angleText; // значение угла в радианах, радиус в пикселях, значение угла в градусах (строка)
        let N, M; // кол-во окружностей, кол-во линий (углов)
        let newX, newY; // координаты 
        let metres; // Метры для отрисовки текста

        switch(this.#scaleNumber)
        {
            case 1: angle = Math.PI / 3;  M = 6;   radius = 4 * this.#pixelSpace; metres = 1000; N = 4; angleText = 'Math.PI/3'; break; // 60 градусов
            case 2: angle = Math.PI / 6;  M = 12;  radius = 8 * this.#pixelSpace; metres = 500; N = 8; angleText = 'Math.PI/6'; break; // 30
            case 3: angle = Math.PI / 12; M = 24;  radius = 16 * this.#pixelSpace; metres = 250; N = 16; angleText = 'Math.PI/12'; break; // 15
            case 4: angle = Math.PI / 12; M = 24;  radius = 16 * this.#pixelSpace; metres = 100; N = 40; angleText = 'Math.PI/12'; break; // 15
        }

        this.#Clear();

        for (let i = 1; i <= N; i += 1)
        {
            this.#context.beginPath();
            this.#context.arc(this.#CirclesCenterX, this.#CirclesCenterY, this.#pixelSpace * i, 0, this.#PI2);
            this.#context.strokeStyle = this.#LineColor;
            this.#context.stroke();
        }


        for (let i = 0; i < M; i++)
        {
            for (let j = 1; j <= N; j++)
            {
                let y2 = this.#CirclesCenterY + this.#pixelSpace * j

                this.#context.beginPath();
                this.#context.moveTo(this.#CirclesCenterX, this.#CirclesCenterY);
                newX = -Math.sin(angle * i) * (y2-this.#CirclesCenterY) + this.#CirclesCenterX;
                newY = -Math.cos(angle * i) * (y2-this.#CirclesCenterY) + this.#CirclesCenterY;
                this.#context.lineTo(newX, newY);
                this.#context.strokeStyle = this.#LineColor;
                this.#context.stroke();

                this.#context.beginPath();
                this.#context.fillStyle = this.#TextColor;
                let aT = (this.RadiansToDegrees(angleText) * (M - i)) === 360 ? 0 : (this.RadiansToDegrees(angleText) * (M - i))
                this.#context.fillText(j == 1 && this.#scaleNumber >= 3? '' : metres * j + 'м; ' + aT + '°', newX + (newX > 0 ? 5 : -5), newY + (newY > this.#CirclesCenterY ? 13 : -8), this.#maximized ? 45 : 35);
            }
        }

    }

    // метод увеличения масштаба
    ScaleUp(pointX = this.#CanvasCenter, pointY = this.#CanvasCenter)
    {
        if (this.#scaleNumber < 4)
        {
            let rect = this.#canvas.getBoundingClientRect();
            let dx = Math.abs(this.#CirclesCenterX - (pointX == this.#CanvasCenter ? pointX : pointX - rect.left))
            let dy = Math.abs(this.#CirclesCenterY - (pointY == this.#CanvasCenter ? pointY : pointY - rect.top))
            let koef

            if (this.#interScale){
                koef = 0.5
                this.#pixelSpace += this.#maximized ? 50 : 25
                this.#interScale = false
            }
            else{
                koef = 0.7
                this.#pixelSpace -= this.#maximized ? 50 : 25
                this.#interScale = true
                this.#scaleNumber += 1
            }

            if (pointX >= this.#CirclesCenterX && pointY <= this.#CirclesCenterY){
                this.#CirclesCenterX -= dx * koef
                this.#CirclesCenterY += dy * koef
            }
            else if (pointX <= this.#CirclesCenterX && pointY <= this.#CirclesCenterY){
                this.#CirclesCenterX += dx * koef
                this.#CirclesCenterY += dy * koef
            }
            else if (pointX <= this.#CirclesCenterX && pointY >= this.#CirclesCenterY){
                this.#CirclesCenterX += dx * koef
                this.#CirclesCenterY -= dy * koef
            }
            else if (pointX >= this.#CirclesCenterX && pointY >= this.#CirclesCenterY){
                this.#CirclesCenterX -= dx * koef
                this.#CirclesCenterY -= dy * koef
            }
            this.#Clear()
            this.Draw()
        }
    }

    // метод уменьшения масштаба
    ScaleDown(pointX = this.#CanvasCenter, pointY = this.#CanvasCenter)
    {
        if (this.#scaleNumber > 1)
        {
            let rect = this.#canvas.getBoundingClientRect();
            let dx = Math.abs(this.#CirclesCenterX - (pointX - rect.left))
            let dy = Math.abs(this.#CirclesCenterY - (pointY - rect.top))
            let koef = 0.6

            if (pointX >= this.#CirclesCenterX && pointY <= this.#CirclesCenterY){
                this.#CirclesCenterX += dx * koef
                this.#CirclesCenterY -= dy * koef
            }
            else if (pointX <= this.#CirclesCenterX && pointY <= this.#CirclesCenterY){
                this.#CirclesCenterX -= dx * koef
                this.#CirclesCenterY -= dy * koef
            }
            else if (pointX <= this.#CirclesCenterX && pointY >= this.#CirclesCenterY){
                this.#CirclesCenterX -= dx * koef
                this.#CirclesCenterY += dy * koef
            }
            else if (pointX >= this.#CirclesCenterX && pointY >= this.#CirclesCenterY){
                this.#CirclesCenterX += dx * koef
                this.#CirclesCenterY += dy * koef
            }
            this.#scaleNumber -= 1
            if (this.#scaleNumber == 1){
                this.Reset();
            }
            else {
                this.#Clear();
                this.Draw()    
            }
        }
        else if (this.#scaleNumber == 1 && this.#interScale == false){
            this.Reset();
            this.#interScale = true
        }
    }

    // метод для перемещения карты
    Move(MouseXbyV, MouseYbyV)
    {
        if (this.#scaleNumber != 1 || this.#scaleNumber == 1 && this.#interScale == false){
            this.#CirclesCenterX -= (this.#distanceX - MouseXbyV)
            this.#CirclesCenterY -= (this.#distanceY - MouseYbyV)
            this.SetDistance(MouseXbyV, MouseYbyV)
            this.#Clear()
            this.Draw()
        }
    }

    // метод установки расстояния мыши от начала (координат) экрана для перемещения по карте
    SetDistance(MouseXbyV, MouseYbyV)
    {
        this.#distanceX = MouseXbyV
        this.#distanceY = MouseYbyV
    }

    // метод очистки холста
    #Clear()
    {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    // метод для сброса рисунка к изначальному состоянию
    Reset(){
        this.#CirclesCenterX = this.#canvas.width / 2;
        this.#CirclesCenterY = this.#canvas.height / 2;
        this.#CanvasCenter = this.#canvas.width / 2;
        this.#scaleNumber = 1;
        this.#pixelSpace = this.#maximized ? 100 : 50
        this.#interScale = true
        this.#Clear();
        this.Draw()
    }
    
    // метод увеличения/уменьшения карты
    Resize()
    {
        if (!this.#maximized){
            this.#canvas.width = 900;
            this.#canvas.height = 900;
            
            this.#pixelSpace = 100;
            this.#context.font = '19px mono'
            this.#CanvasCenter = this.#canvas.width / 2
            this.#maximized = !this.#maximized
        }
        else{
            this.#canvas.width = 450;
            this.#canvas.height = 450

            this.#pixelSpace = 50
            this.#context.font = '13px mono'
            this.#CanvasCenter = this.#canvas.width / 2
            this.#maximized = !this.#maximized
        }

        this.Reset()
    }

    // метод перевода радиан в градусы
    RadiansToDegrees(angle)
    {
        switch(angle)
        {
            case 'Math.PI/3' : return 60;
            case 'Math.PI/6' : return 30;
            case 'Math.PI/12' : return 15;
            default : return 1;
        }
    }
}