﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.GroupDTO
{
    public class RequestJoinGroupDTO
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string UserAvata { get; set; }
    }
}
