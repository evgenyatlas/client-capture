         /**Отрисовка вращения**/
        //Получаем наш угол из EasingValue (для анимации)
        // let rotate = this.rotation.get() - map.getBearing()
        // if (rotate) {
        //     ctx.translate(position.x, position.y)
        //     ctx.rotate(toRadians(rotate))
        //     ctx.translate(-position.x, -position.y)
        // }

   //Сброс вращения (что бы вращение происходило только у аватарки)
        // if (rotate) {
        //     ctx.translate(position.x, position.y);
        //     ctx.rotate(-toRadians(rotate));
        //     ctx.translate(-position.x, -position.y);
        // }